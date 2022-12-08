import { Divider } from "@mantine/core";

export default function Actions() {

  return (
    <div className="mt-4">
      <Divider my="md" />
      <div className="flex flex-row relative select-none w-100 justify-center gap-4">
        <button className="btn-neutral" onClick={() => console.log('Stand')}>
          Check
        </button>
        <button className="btn-warning" onClick={() => console.log('Fold')}>
          Fold
        </button>
        <button className="btn" onClick={() => console.log('Bet')}>
          Bet
        </button>
        </div>
    </div>
  );
}
