import { Medal } from "lucide-react";

const MarketingPage = () => {
  return (
    <div className="flex  items-center justify-center flex-col">
      <div className="flex items-center justify-center flex-col">
        <div className="text-amber-700 items-center border shadow-sm p-4 bg-amber-100 txt-amber-700 rounded-full uppercase">
          <Medal className=" h-6 w-6 mr-2 " />
          No 1 Task Management Software
        </div>
        <h1 className="text-3xl md:text-6xl text-center text-neutral-800 mb-6 ">
          Geass Helps Team Move
        </h1>
        <div className="text-31 md:text-6xl bg-gradient-to-r from-fuchsia-600 to-pink-600  text-white px-4 p-2 rounded-md pb-4 w-fit">
          Work Forward
        </div>
      </div>
    </div>
  );
};
export default MarketingPage;
