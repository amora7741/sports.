import ShaderBackground from '@/components/ShaderBackground';
import { fetchMatch, fetchSources } from '@/helpers/fetch-data';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MoveRight, Play, Radio } from 'lucide-react';

const Match = async ({ params }: { params: Promise<{ matchID: string }> }) => {
  const { matchID } = await params;

  const match = await fetchMatch(matchID);

  if (!match?.sources?.length) notFound();

  const sources = (
    await Promise.all(
      match.sources.map(async (source) => {
        const streams = await fetchSources(source.source, source.id);
        return {
          source: source.source,
          streams: streams || [],
        };
      })
    )
  ).filter((source) => source.streams.length > 0);

  const totalStreams = sources.reduce(
    (acc, source) => acc + source.streams.length,
    0
  );

  return (
    <ShaderBackground>
      <div className='relative text-white flex flex-col gap-8 mt-32 mb-12 px-8 max-w-6xl mx-auto'>
        <div>
          <h1 className='text-2xl sm:text-3xl md:text-5xl mb-2'>
            Streams for{' '}
            <span className='italic tracking-tighter font-serif'>
              {match.title}
            </span>
          </h1>

          <p className='text-white/60 text-xs sm:text-sm'>
            {totalStreams} {totalStreams === 1 ? 'stream' : 'streams'} available
          </p>
        </div>

        <div className='w-full border border-b-white/60' />

        <div className='space-y-12'>
          {sources.map((source, i) => (
            <div key={i} className='space-y-4'>
              <div className='flex items-center gap-3'>
                <Radio className='size-4 text-white/60' />
                <h2 className='text-xl sm:text-2xl font-medium'>
                  {source.source.charAt(0).toUpperCase() +
                    source.source.slice(1)}
                </h2>
                <span className='text-xs text-white/40'>
                  ({source.streams.length})
                </span>
              </div>

              <ul className='grid md:grid-cols-2 gap-4'>
                {source.streams.map((stream) => (
                  <li key={stream.source + stream.streamNo} className='group'>
                    <Link
                      href={`/watch/${match.id}/${stream.source}/${stream.streamNo}`}
                      className='flex items-center justify-between p-4 rounded-lg border border-white/10 hover:border-white/30 hover:bg-white/5 transition-all duration-75'
                    >
                      <div className='flex items-center gap-4'>
                        <div className='p-2 rounded-md bg-white/5 group-hover:bg-white/10 transition-colors'>
                          <Play className='size-4' fill='currentColor' />
                        </div>
                        <div>
                          <span className='text-sm sm:text-base font-medium'>
                            Stream {stream.streamNo}
                          </span>
                          <p className='text-xs text-white/40 group-hover:text-white/60 transition-colors'>
                            {stream.hd ? 'HD' : 'SD'}
                          </p>
                        </div>
                      </div>
                      <div className='p-2 bg-white/5 rounded-full group-hover:bg-white/10'>
                        <MoveRight className='size-4' />
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className='w-full border border-b-white/60' />
        <p className='text-xs sm:text-sm self-center font-sans text-white/60'>
          End of streams
        </p>
      </div>
    </ShaderBackground>
  );
};

export default Match;
