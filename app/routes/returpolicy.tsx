import type {MetaFunction} from '@netlify/remix-runtime';
import {Container} from '~/components/Container';

export const meta: MetaFunction = () => {
  return [{title: `Skrotmagneten | Returpolicy`}];
};

export default function Returpolicy() {
  return (
    <Container>
      <div className="pb-8">
        <h1 className="text-4xl my-8">Returpolicy</h1>
        <h2 className="text-3xl my-4">Vår returpolicy</h2>
        <p>
          Om du inte är nöjd med de mottagna produkterna kan du byta den på
          något av följande sätt:
        </p>
        <h2 className="text-3xl my-4">Byte</h2>
        <p>
          Kontakta oss via{' '}
          <a href="mailto:hej@skrotmagneten.se">hej@skrotmagneten.se</a>, begär
          en retursedel och skicka tillbaka varan med posten. Du kan byta ut
          produkten mot en annan, eller i händelse av att bytet beror på
          funktionsfel byts den mot en ny produkt som sedan skickas på nytt till
          dig.
        </p>
        <h2 className="text-3xl my-4">Retur</h2>
        <p>
          Om produkten inte motsvarade dina förväntningar kan du returnera och
          få pengarna tillbaka. Kontakta oss inom 14 dagar från att du mottagit
          produkten och informera om att du önskar lämna tillbaka den. Skicka
          den sedan tillbaka till oss på följande adress:
          <br />
          <br />
          Bridget Hovslagare AB
          <br />
          Norra Catalinagränd 10
          <br />
          183 68 Täby
          <br />
          Sverige
        </p>
      </div>
    </Container>
  );
}
