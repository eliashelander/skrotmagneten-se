import type {MetaFunction} from '@netlify/remix-runtime';
import {Container} from '~/components/Container';

export const meta: MetaFunction = () => {
  return [{title: `Skrotmagneten | Om oss`}];
};

export default function OmOss() {
  return (
    <Container>
      <div className="pb-8">
        <h1 className="text-4xl my-8">Om oss</h1>
        <div className="flex flex-col gap-16">
          <div className="inline-block">
            <img
              className="float-right max-h-[500px] w-auto pl-8"
              alt={'Bridget hovslagare skor en häst'}
              src="https://cdn.shopify.com/s/files/1/0847/4509/3413/files/bridget-hovslagare.webp?v=1702908723"
            />
            <h2 className="text-3xl py-4">
              Från IT-försäljning till hantverket hovslageri till webshop med
              stallmagneten och Skrotmagneten.
            </h2>
            <p>
              Efter större delen av mitt yrkesverksamma liv som tjänsteman inom
              IT sadlade jag om till hovslagare. En helt annan värld med helt
              andra behov och det var här som först Stallmagneten föddes. Vill
              du veta mer om den resan kan du läsa ”om oss” på
              www.stallmagneten.se. Nu har det gått ett antal år och
              Stallmagneten finns på väldigt många stall som en uppskattad hjälp
              som ”stallborste” vid skoning av hästar. Det intressanta är att
              flera andra branscher än häst-näringen hittat till Stallmagneten
              vilket såklart är jätteroligt. Och då föddes ännu ett varumärke -
              Skrotmagneten!
            </p>
          </div>
        </div>
      </div>
    </Container>
  );
}
