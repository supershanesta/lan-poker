import Link from 'next/link';

export default function Header() {
  const clearGame = () => {
    // FIXME: Not very elegant, but using normal router would just stuck me in a infinite loop
    //        even if I removed query parameter and push it to load home page
    window.location.href = window.location.origin;
  };

  return (
    <div>
      <Link href="/">
        <a onClick={clearGame}>
          <h1 className="text-4xl font-bold flex space-x-2">
            <span>Poker Party</span>
          </h1>
        </a>
      </Link>
    </div>
  );
}