import {useState, useEffect, useRef} from 'react';

interface Testimonial {
  name: string;
  text: string;
}

interface TestimonialsProps {
  testimonials: Testimonial[];
}

export function Testimonials({testimonials}: TestimonialsProps) {
  const [manualPause, setManualPause] = useState(false);
  const [curr, setCurr] = useState(0);
  const intevalTimer = useRef<null | number>(null);

  const autoSlide = true;
  const autoSlideInterval = 6000;

  const prev = () => {
    setCurr((curr) => (curr === 0 ? testimonials.length - 1 : curr - 1));
  };
  const next = () => {
    setCurr((curr) => (curr === testimonials.length - 1 ? 0 : curr + 1));
  };

  useEffect(() => {
    if (!autoSlide) return;
    if (!manualPause) {
      clearInterval(intevalTimer.current);
      intevalTimer.current = setInterval(next, autoSlideInterval);
      return () => clearInterval(intevalTimer.current);
    }
    intevalTimer.current = setInterval(() => {
      setManualPause(false);
      next();
    }, 12000);
    return () => clearInterval(intevalTimer.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [manualPause, curr]);

  const handleClickPrev = () => {
    setManualPause(true);
    clearInterval(intevalTimer.current);
    prev();
  };

  const handlelClickNext = () => {
    setManualPause(true);
    clearInterval(intevalTimer.current);
    next();
  };

  return (
    <div className="relative overflow-hidden min-h-[120px] sm:min-h-[250px] py-8 my-16">
      <div
        className="flex min-h-[120px] sm:min-h-[250px] transition-transform ease-in-out duration-1000"
        style={{transform: `translateX(-${curr * 100}%)`}}
      >
        {testimonials.map((testimonial) => (
          <div
            className="flex min-w-full justify-center items-center"
            key={testimonial.name}
          >
            <div className="sm:px-16 sm:max-w-[1000px]">
              <p className="text-center mb-4">{testimonial.text}</p>
              <p className="text-center font-bold text-xl">
                {testimonial.name}
              </p>
            </div>
          </div>
        ))}
      </div>
      <div className="absolute inset-0 flex items-end mb-4 sm:mb-0 sm:items-center justify-between">
        <button
          onClick={handleClickPrev}
          className="flex text-5xl text-black/50 hover:text-black items-center justify-center w-10 h-10 rounded-full"
        >
          {'<'}
        </button>
        <button
          onClick={handlelClickNext}
          className="flex text-5xl text-black/50 hover:text-black items-center justify-center w-10 h-10 rounded-full"
        >
          {'>'}
        </button>
      </div>

      <div className="absolute bottom-4 right-0 left-0">
        <div className="flex items-center justify-center gap-2">
          {testimonials.map((testimonial, i) => (
            <button key={testimonial.name} onClick={() => setCurr(i)}>
              <div
                className={`
              transition-all w-2 h-2 shadow-sm rounded-full
              ${curr === i ? 'bg-black' : 'bg-black/50'}
              `}
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
