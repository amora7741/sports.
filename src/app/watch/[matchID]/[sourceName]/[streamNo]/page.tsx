import StaticBackground from '@/components/StaticBackground';
import { fetchMatch, fetchSources } from '@/helpers/fetch-data';
import { notFound } from 'next/navigation';

interface StreamPageProps {
  params: Promise<{ matchID: string; sourceName: string; streamNo: string }>;
}

async function getStreamData(
  matchID: string,
  sourceName: string,
  streamNo: string
): Promise<Stream> {
  const match = await fetchMatch(matchID);

  if (!match?.sources?.length) {
    notFound();
  }

  const source = match.sources.find((source) => source.source === sourceName);
  if (!source) notFound();

  const streams = await fetchSources(source.source, source.id);
  if (!streams) notFound();

  const stream = streams.find((stream) => stream.streamNo === Number(streamNo));
  if (!stream) notFound();

  return stream;
}

const StreamPage = async ({ params }: StreamPageProps) => {
  const { matchID, sourceName, streamNo } = await params;

  const stream = await getStreamData(matchID, sourceName, streamNo);

  return (
    <StaticBackground>
      <div className='min-h-dvh max-w-6xl mx-auto relative text-white flex flex-col items-center justify-center px-8'>
        <iframe
          className='aspect-video rounded-lg'
          allowFullScreen
          referrerPolicy='no-referrer'
          allow='autoplay; fullscreen; picture-in-picture; encrypted-media; popups'
          src={stream.embedUrl}
          title={`Stream ${stream.streamNo} - ${stream.language}`}
        />
      </div>
    </StaticBackground>
  );
};

export default StreamPage;
