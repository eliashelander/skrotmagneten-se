import type {MetaFunction} from '@netlify/remix-runtime';
import {Container} from '~/components/Container';

export const meta: MetaFunction = () => {
  return [{title: `Stallmagneten | Kontakta oss`}];
};

export default function Kontakt() {
  return (
    <Container>
      <div className="pb-8">
        <h1 className="text-4xl my-8">Kom i kontakt med oss </h1>
        <p>
          Kontakta oss gärna via{' '}
          <a href="mailto:hej@stallmagneten.se">hej@stallmagneten.se</a> så
          återkommer vi så fort vi kan.
        </p>
      </div>
    </Container>
  );
}
