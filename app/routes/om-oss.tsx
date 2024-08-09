import type {MetaFunction} from '@netlify/remix-runtime';
import {Container} from '~/components/Container';

export const meta: MetaFunction = () => {
  return [{title: `Stallmagneten | Om oss`}];
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
              Från it-försäljning till hantverket hovslageri
            </h2>
            <p>
              Efter många år i IT-branschen sadlade jag om till hovslagare. Det
              var det bästa jag någonsin gjort i karriärväg! Jag blev en ”nörd”
              och hade bara fokus på att bli så himla bra att jag inte skulle
              behöva leta kunder utan kunder skulle höra av sig till mig via
              rekommendation. Så har det blivit och jag är så tacksam att jag
              vågade ta steget och det är ett privilegium att få jobba med dessa
              fantastiska djur. Jag har också fått många fina tvåbenta vänner
              för livet pga detta jobb! År 2012-2013 gick jag fortbildningen på
              BYS (Biologiska Yrkeshögskolan i Skara) för att få ännu mer
              kunskap och bli av Jordbruksverket Godkänd Hovslagare, vilket jag
              blev vintern 2013. Nu skor jag ridhästar inom både hopp, dressyr
              och Islandshäst. Jag håller mestadels till norr om Stockholm dvs i
              Täby, Vallentuna och Vaxholm.
            </p>
          </div>
          <div className="inline-block">
            <img
              className="float-left max-h-[500px] w-fit pr-8"
              alt={'Bridget och Greifi'}
              src="https://cdn.shopify.com/s/files/1/0847/4509/3413/files/briget_och_greifi.jpg?v=1702908723"
            />
            <h2 className="text-3xl py-4">Stallmagneten föds...</h2>
            <p>
              När jag var ”nybakad” hovslagare vid 2010-tiden var vi två
              kollegor som började spåna på en idé om en söm-uppsamlare när vi
              skodde våra kunders hästar. Sömmen kan vara förödande och tom
              kräva avlivning av hästen om den trampar in den på ”fel” ställe i
              hoven. Vi kom i kontakt med ett företag som hade en sådan produkt
              och wipps så var Stallmagneten född! Nu började arbetet med att
              skapa varumärket och bygga försäljningskanalen på nätet. Kollegan
              hoppade av projektet men jag trodde på den här och påbörjade resan
              med varumärkes-skapande och hemsidan.
              <br />
              <br />
              Nu har det gått ett antal år och Stallmagneten finns på många
              ställen, inte bara på stall utan byggbranschen och andra branscher
              ser också fördelar med Stallmagneten, vilket är jättekul!
              <br />
              <br />
              Stallmagneten har också fått erkännande i hästbranschen via bl.a.
              HIPSON 2017 där den nominerades som årets pryl. Vi vann inte
              omröstningen men vi vann Silverplatsen av 6 möjliga! Jätteroligt!
              Livsstilsmagasinet Equipage uppmärksammade också Stallmagneten.
            </p>
          </div>
        </div>
      </div>
    </Container>
  );
}
