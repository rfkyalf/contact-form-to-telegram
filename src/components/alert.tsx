export default function Alert({ bgColor, icon, status, message, onClick }: { bgColor: string; icon: string; status: string; message: string; onClick: () => void }) {
  return (
    <div className={`flex justify-between items-center ${bgColor} py-2 px-2 md:px-4 rounded-md mb-4`}>
      <div className="flex gap-2 text-indigo-950 text-xs md:text-base">
        <div>{icon}</div>
        <div className="flex">
          <span className="font-bold">{status} &nbsp;</span>
          <p>{message}</p>
        </div>
      </div>
      <button onClick={onClick}>✖</button>
    </div>
  );
}
