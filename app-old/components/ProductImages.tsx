import {Image} from '@shopify/hydrogen';
import {useState} from 'react';
import type {ProductFragment} from 'storefrontapi.generated';

export function ProductImages({
  images,
}: {
  images: ProductFragment['images']['nodes'];
}) {
  const [currImage, setCurrImage] = useState(0);
  const [[x, y], setXY] = useState([0, 0]);
  const [[imgWidth, imgHeight], setSize] = useState([0, 0]);
  const [showMagnifier, setShowMagnifier] = useState(false);

  if (images.length === 0) {
    return <div className="product-image" />;
  }
  return (
    <div className="relative overflow-hidden">
      <div
        className="flex min-h-[120px] sm:min-h-[250px] transition-transform ease-in-out duration-1000"
        style={{transform: `translateX(-${currImage * 100}%)`}}
        onMouseEnter={(e) => {
          // update image size and turn-on magnifier
          const elem = e.currentTarget;
          const {width, height} = elem.getBoundingClientRect();
          setSize([width, height]);
          setShowMagnifier(true);
        }}
        onMouseMove={(e) => {
          // update cursor position
          const elem = e.currentTarget;
          const {top, left} = elem.getBoundingClientRect();

          // calculate cursor position on the image
          const x = e.pageX - left - window.pageXOffset;
          const y = e.pageY - top - window.pageYOffset;
          setXY([x, y]);
        }}
        onMouseLeave={() => {
          // close magnifier
          setShowMagnifier(false);
        }}
      >
        {images.map((image) => (
          <div
            className="flex min-w-full justify-center items-center"
            key={image.id}
          >
            <Image
              alt={image.altText || 'Product Image'}
              aspectRatio="1/1"
              data={image}
              key={image.id}
              sizes="(min-width: 45em) 50vw, 100vw"
            />
            <div
              style={{
                display: showMagnifier ? '' : 'none',
                position: 'absolute',

                // prevent maginier blocks the mousemove event of img
                pointerEvents: 'none',
                // set size of magnifier
                height: `${300}px`,
                width: `${300}px`,
                // move element center to cursor pos
                top: `${y - 300 / 2}px`,
                left: `${x - 300 / 2}px`,
                opacity: '1', // reduce opacity so you can verify position
                border: '1px solid lightgray',
                backgroundColor: 'white',
                backgroundImage: `url('${images[currImage].url}')`,
                backgroundRepeat: 'no-repeat',

                //calculate zoomed image size
                backgroundSize: `${imgWidth * 2}px ${imgHeight * 2}px`,

                //calculete position of zoomed image.
                backgroundPositionX: `${
                  -(x - currImage * imgWidth) * 2 + 300 / 2
                }px`,
                backgroundPositionY: `${-y * 2 + 300 / 2}px`,
              }}
            ></div>
          </div>
        ))}
      </div>
      <div className="py-2">
        <div className="flex justify-start gap-2">
          {images.map((image, i) => (
            <button
              key={image.id}
              onClick={() => setCurrImage(i)}
              className="flex-1 max-w-[112px]"
            >
              <div
                className={`${
                  currImage === i && 'border-2 border-black/50 rounded-md'
                }`}
              >
                <Image
                  alt={image.altText || 'Product Image'}
                  aspectRatio="1/1"
                  data={image}
                  key={image.id}
                  sizes="(min-width: 45em) 50vw, 100vw"
                />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
