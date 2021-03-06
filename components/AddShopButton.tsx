import Link from "next/link";
import PointIcon from "../assets/point-icon.svg";

const PositionStyle = "absolute bottom-12 right-0 w-full flex justify-end";
const WrapperStyle = "flex items-center cursor-pointer relative z-20";
const IconWrapperStyle =
  "bg-yellow-500 rounded-full -mr-4 z-20 h-16 w-16 flex justify-center items-center shadow-lg";
const IconStyle = "fill-current text-white";
const LabelWrapperStyle = "bg-gray-100 px-4 py-3 pl-8 shadow-lg relative z-10";
const LabelStyle = "";

const AddShopButton = (): React.ReactElement => {
  return (
    <div className={PositionStyle}>
      <Link href="/shops/new">
        <div className={WrapperStyle}>
          <div className={IconWrapperStyle}>
            <PointIcon className={IconStyle} width={32} height={32} />
          </div>
          <div className={LabelWrapperStyle}>
            <span className={LabelStyle}>Agregar negocio</span>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default AddShopButton;
