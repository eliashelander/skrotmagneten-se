import type {MetaFunction} from '@netlify/remix-runtime';
import {Container} from '~/components/Container';

export const meta: MetaFunction = () => {
  return [{title: `Skrotmagneten | Köpvillkor`}];
};

export default function Kopvillkor() {
  return (
    <Container>
      <div className="pb-8">
        <h1 className="text-4xl my-8">Köpvillkor</h1>
        <h2 className="text-3xl my-4">
          1. Om Skrotmagneten (Bridget Hovslagare AB)
        </h2>
        <p>
          Företaget har sitt säte i Täby. Företagets postadress är Täby, 18368,
          Norra Catalinagränd 10.
          <br />
          Önskar du att komma i kontakt med oss, skicka ett mail till
          hej@skrotmagneten.se med ditt ärende och dina kontaktuppgifter så hör
          vi av oss inom kort.
        </p>
        <h2 className="text-3xl my-4">2. Beställning</h2>
        <p>
          När du slutfört din beställning skickas en orderbekräftelse till din
          e-postadress. I bekräftelsen finner du alla uppgifter om produkter,
          pris, fakturerings- och leveransadress.
          <br />
          Är något fel i orderbekräftelsen ska du omedelbart kontakta oss via
          e-post till hej@skrotmagneten.se.
        </p>
        <h2 className="text-3xl my-4">3. Leverans</h2>
        <p>
          Våra normala leveranstider är 2-5 dagar. OBS! Beställningar lagda på
          helger skickas tidigast på måndagen efter.
          <br />
          Om förseningar i leveransen skulle uppstå (utan att vi har meddelat
          dig om längre leveranstid) ska du kontakta oss på e-postadress:
          hej@skrotmagneten.se.
        </p>
        <h2 className="text-3xl my-4">4. Priser</h2>
        <p>
          Alla priser i butiken anges i SEK och alla priser är inklusive 25%
          moms.
          <br />
          Vi reserverar oss för prisändringar orsakat av prisändring från
          leverantör, feltryck i prislistan samt felaktigheter i priser beroende
          på felaktig information och förbehåller oss rätten att justera priset.
        </p>
        <h2 className="text-3xl my-4">5. Ångerrätt</h2>
        <p>
          Vid köp av varor på webbplatsen har du som kund en lagstiftad 14
          dagars ångerrätt som gäller från det att du har tagit emot en vara som
          du har beställt.
        </p>
        <div className="pl-8">
          <h3 className="text-2xl my-4">5.1 Vid nyttjande av din ångerrätt</h3>
          <p>
            Du måste meddela att du ångrar dig. Meddelandet ska skickas till oss
            hej@skrotmagneten.se. I ditt meddelande ska ditt namn, din adress,
            e-postadress, ordernumret samt vilka varor som returneringen gäller
            framgå klart och tydligt.
            <br />
            Du bör omedelbart och senast inom lagstiftad 14 dagar efter
            ångermeddelandet returnera produkterna till oss.
            <br />
            Du står för returfrakt, leverans och skick på produkterna vid retur,
            produkterna bör därför skickas välpaketerade och i ursprunglig
            förpackning.
            <br />
            På återbetalningsbeloppet förbehåller vi oss rätten att dra av en
            summa motsvarande värdeminskningen jämfört med varans ursprungliga
            värde vid använd eller skadad produkt.
          </p>
          <h3 className="text-2xl my-4">5.2 Ångerrätten gäller inte vid</h3>
          <p>
            Produkter som på grund av hälso- eller hygienskäl har förseglats
            (plomberats) och där förseglingen (plomberingen) har brutits av dig.
            <br />
            Produkter som har karaktär av förseglad ljud- eller bildupptagning
            och där förseglingen har brutits av dig.
            <br />
            Specialtillverkad produkt, som har skräddarsytts särskilt åt dig
            eller har en tydlig personlig prägel efter dina önskemål.
            <br />
            Tjänster som har fullgjorts och där du uttryckligen har samtyckt
            till att tjänsten påbörjas utan ångerrätt.
            <br />
            Varor som snabbt kan försämras, exempelvis livsmedel.
            <br />
            Lösnummer av tidningar eller tidskrifter.
            <br />
            <br />
            För mer om den lagstiftade ångerrätten, se{' '}
            <a href="http://www.konsumentverket.se/for-foretag/konsumentratt-for-foretagare/om-kunden-angrar-sitt-kop/">
              här
            </a>
            .
          </p>
        </div>
        <h2 className="text-3xl my-4">6. Reklamation och klagomål</h2>
        <p>
          Vi besiktigar alla produkter innan dessa skickas till dig. Skulle
          produkten ändå vara skadad eller felexpedierad när den anländer åtar
          vi oss i enlighet med gällande konsumentskyddslagstiftning att
          kostnadsfritt åtgärda felet.
          <br />
          Du måste alltid kontakta oss för ett godkännande innan du returnerar
          en defekt vara.
          <br />
          Klagomålet ska skickas omedelbart efter att defekten har upptäckts.
        </p>
        <div className="pl-8">
          <h3 className="text-2xl my-4">
            6.1 Hur går du tillväga vid reklamation?
          </h3>
          <p>
            Eventuella fel och defekt ska alltid reklameras till
            hej@skrotmagneten.se där du anger ditt namn, din adress,
            e-postadress, ordernummer och en beskrivning av felet.
            <br />
            Om det inte lyckas oss att åtgärda felet eller leverera en liknande
            produkt, återbetalar vi dig för den defekta produkten i enlighet med
            gällande konsumentskyddslagstiftning. Vi står för returfrakt vid
            godkända reklamationer.
            <br />
            Vi förbehåller oss rätten att neka en reklamation om det visar sig
            att varan inte är felaktig i enlighet med gällande
            konsumentskyddslagstiftning. Vid reklamationer följer vi riktlinjer
            från Allmänna Reklamationsnämnden, se arn.se.
          </p>
        </div>
        <h2 className="text-3xl my-4">7. Ansvarsbegränsning </h2>
        <p>
          Vi tar inget ansvar för indirekta skador som kan uppstå på grund av
          produkten.
          <br />
          Vi accepterar inget ansvar för förseningar/fel till följd av
          omständigheter utanför företagets rådande (Force Majeure). Dessa
          omständigheter kan exempelvis vara arbetskonflikt, eldsvåda, krig,
          myndighetsbeslut, förminskad eller utebliven leverans från leverantör.
          <br />
          Vidare tas inget ansvar för eventuella förändringar på
          produkter/produktegenskaper som ändrats av respektive leverantör och
          andra faktorer utanför vår kontroll.
        </p>
        <h2 className="text-3xl my-4">8. Produktinformation</h2>
        <p>
          Vi reserverar oss för eventuella tryckfel på denna webbplats samt
          slutförsäljning av produkter. Vi garanterar inte att bilderna återger
          produkternas exakta utseende då en viss färgskillnad kan förekomma
          beroende på bildskärm, fotokvalitet samt upplösning. Vi försöker
          alltid på bästa sätt att exponera produkterna så korrekt som möjligt.
        </p>
        <h2 className="text-3xl my-4">9. Information om Cookies</h2>
        <p>
          Enligt lag om elektronisk information ska besökare på en webbplats i
          integritetssyfte få information om att cookies används. Informationen
          i cookien är möjlig att använda för att följa en användares surfande.
          Cookie är en liten textfil som webbplatsen du besöker begär att få
          spara på din dator för att ge tillgång till olika funktioner. Det går
          att ställa in sin webbläsare så att den automatiskt nekar cookies. Mer
          information kan man hitta på Post och telestyrelsens hemsida.
        </p>
        <h2 className="text-3xl my-4">10. Personuppgifter</h2>
        <p>
          Genom att handla hos Skrotmagneten (Bridget Hovslagare AB) accepterar
          du vår dataskyddspolicy och vår behandling av dina personuppgifter. Vi
          värnar om din personliga integritet och samlar inte in fler uppgifter
          än nödvändigt för att behandla din beställning. Vi säljer eller
          vidareger aldrig dina uppgifter till tredjepart utan rättslig grund.
          <br />
          Skrotmagneten (Bridget Hovslagare AB) är ansvarig för behandlingen av
          personuppgifter som du lämnat till oss som kund. Dina personuppgifter
          behandlas av oss för att kunna hantera din beställning samt i de
          tillfällen då du har önskat nyhetsbrev eller kampanjerbjudanden - för
          att kunna anpassa marknadsföringen åt dina individuella behov.
          <br />
          Nedan information är en summering av hur vi i enlighet med{' '}
          <a href="https://www.imy.se/verksamhet/dataskydd/det-har-galler-enligt-gdpr/introduktion-till-gdpr/">
            dataskyddsförordningen
          </a>{' '}
          (GDPR) lagrar och behandlar dina uppgifter.
        </p>
        <div className="pl-8">
          <h3 className="text-2xl my-4">10.1 Vad är en personuppgift?</h3>
          <p>
            En personuppgift är all information som direkt eller indirekt kan
            hänföras till en fysisk person.
          </p>
          <h3 className="text-2xl my-4">10.2 Vilka uppgifter lagrar vi?</h3>
          <p>
            För att kunna hantera din beställning samt svara på frågor relaterat
            till din order (kundtjänst) lagrar vi ditt förnamn- och efternamn,
            adress, telefonnummer, e-postadress, ip-adress och köphistorik.
            <br />
            Dina uppgifter lagras så länge vi har en rättslig grund att behandla
            dina uppgifter, exempelvis för att fullfölja avtalet mellan oss
            eller för att efterleva en rättslig förpliktelse enligt exempelvis
            bokföringslagen.
          </p>
          <h3 className="text-2xl my-4">10.3 Rättslig grund</h3>
          <p>
            I samband med ett köp behandlas dina personuppgifter för att
            fullfölja avtalet med dig. Marknadsföring, kampanjer och liknande
            utskick sker efter samtycke från dig.
          </p>
          <h3 className="text-2xl my-4">
            10.4 Vilka uppgifter delas och med vilket syfte?
          </h3>
          <div className="pl-8">
            <h4 className="text-xl my-4">10.4.1 Betalleverantör</h4>
            <p>
              Vid genomförande av köp, delas information med vår
              betalleverantör. Det som lagras är förnamn, efternamn, adress,
              e-postadress och telefonnummer. Väljer du att betala med faktura
              sparas även personnummer hos betalleverantören. Informationen
              sparas för att kunna genomföra köpet och för att skydda parterna
              mot bedrägeri.
              <br />
              De betalleverantörer (betaltjänster) som vi använder oss av är:
              Klarna, Swish, Kortbetallning.
            </p>
            <h4 className="text-xl my-4">10.4.2 Fraktbolag</h4>
            <p>
              För att kunna leverera dina beställningar och slutföra vårt avtal
              måste vi dela med specifik information med fraktbolaget. Det som
              delas med fraktbolaget är förnamn, efternamn samt adressuppgifter
              för leverans. E-postadress och/eller mobilnummer kan även komma
              att delas med fraktbolaget för avisering.
              <br />
              De fraktbolag vi samarbetar med är: Postnord.
            </p>
            <h4 className="text-xl my-4">10.4.3 Nyhetsbrev</h4>
            <p>
              Har du valt att prenumerera på vårt nyhetsbrev delas förnamn,
              efternamn och e-postadress med vår nyhetsbrevsleverantör. Detta
              för att kunna hålla dig uppdaterad med information och erbjudanden
              i marknadsföringssyfte.
              <br />
              Vi använder Mailchimp för utskick av nyhetsbrev.
            </p>
          </div>
          <h3 className="text-2xl my-4">10.5 Rätten till tillgång</h3>
          <p>
            Du har rätt att få utdrag av all information som finns om dig hos
            oss. Utdrag levereras elektroniskt i ett läsbart format.
          </p>
          <h3 className="text-2xl my-4">10.6 Rätt till rättelse</h3>
          <p>
            Du har rätt att be oss uppdatera felaktig information eller
            komplettera information som är bristfällig.
          </p>
          <h3 className="text-2xl my-4">10.7 Rätten att bli glömd</h3>
          <p>
            Du kan när som helst be att uppgifterna som avser dig raderas. Det
            finns få undantag till rätten till radering, som till exempel om det
            ska behållas för att vi måste uppfylla en rättslig förpliktelse
            (exempelvis enligt bokföringslagen).
          </p>
          <h3 className="text-2xl my-4">10.8 Ansvarig för dataskydd</h3>
          <p>
            Skrotmagneten (Bridget Hovslagare AB) är ansvarig för lagring och
            behandling av personuppgifter i webbutiken och ser till att reglerna
            efterföljs.
          </p>
          <h3 className="text-2xl my-4">
            10.9 Så skyddar vi dina personuppgifter
          </h3>
          <p>
            Vi använder oss av industristandarder som SSL/TLS och envägs
            hash-algoritmer för att lagra, behandla och kommunicera känslig
            information som exempelvis personuppgifter och lösenord på ett
            säkert sätt.
            <br />
            Vi använder en Kanadensisk plattform, Shopify.
          </p>
        </div>
        <h2 className="text-3xl my-4">
          11. Ändringar till de Allmänna Villkoren
        </h2>
        <p>
          Vi förbehåller oss rätten att när som helst företa ändringar i
          villkoren. Ändringar av villkoren kommer att publiceras online på
          webbplatsen. De ändrade villkoren anses för accepterade i samband med
          order eller besök på webbplatsen.
        </p>
        <h2 className="text-3xl my-4">12. Tvist och lagval</h2>
        <p>
          I tillfälle av att tvist inte kan lösas i samförstånd med företagets
          kundtjänst och kunden, kan du som kund vända dig till Allmänna
          Reklamationsnämnden, se arn.se. För boende i ett annat EU-land än
          Sverige kan man lämna klagomål online via EU-kommissionens plattform
          för medling i tvister, se{' '}
          <a href="http://ec.europa.eu/consumers/odr">
            http://ec.europa.eu/consumers/odr
          </a>
          <br />
          Vid eventuell tvist följer vi beslut från ARN eller motsvarande
          tvistlösningsorgan.
          <br />
          Tvist gällande tolkningen eller tillämpningen av dessa allmänna
          villkor ska tolkas i enlighet med svensk rätt och lag.
        </p>
      </div>
    </Container>
  );
}
