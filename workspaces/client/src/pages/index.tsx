import type { NextPage } from 'next';
import GameManager from '@components/game/GameManager';
import Header from '@components/layout/Header';
import { useRouter } from 'next/router';

const Page: NextPage = () => {
  const router = useRouter();
  return (
    <div className="container max-w-5xl mt-16 px-4 md:px-0">
      <Header/>
        <GameManager/>
    </div>
  );
};

export default Page;
