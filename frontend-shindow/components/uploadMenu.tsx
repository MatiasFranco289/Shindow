import { MdOutlineFileUpload } from "react-icons/md";
import { useExplorer } from "./explorerProvider";
import UploadCard from "./uploadCard";

export default function UploadMenu() {
  const { uploadClipboard, isUploadMenuOpen, setUploadMenuOpen } =
    useExplorer();

  return (
    <div className="relative">
      <div
        className={`p-1 rounded-md cursor-pointer ${
          isUploadMenuOpen ? "bg-white/20" : "hover:bg-white/10"
        }`}
        onClick={() => {
          setUploadMenuOpen(!isUploadMenuOpen);
        }}
      >
        <MdOutlineFileUpload className="text-3xl" />
      </div>
      {isUploadMenuOpen && (
        <div
          className="absolute top-9 right-0 bg-custom-green-150 p-4 rounded-lg w-[450px] max-h-[50vh]
        overflow-scroll duration-200"
        >
          {uploadClipboard.length ? (
            uploadClipboard.map((resourceToUpload, index) => {
              return (
                <UploadCard
                  key={`upload_card_${index}`}
                  status={"queued"}
                  unit="mb"
                  progress={20}
                  totalSize={100}
                  uploadClipboardItem={resourceToUpload}
                />
              );
            })
          ) : (
            <div className=" rounded-2xl p-3">
              <h2 className="font-thin text-white/60">
                This looks empty. Why don't you upload something?
              </h2>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
