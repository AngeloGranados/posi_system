interface ButtonOrderAscDescProps {
    onClick: () => void,
    isAsc: boolean,
    isActive: boolean
}

export default function ButtonOrderAscDesc({ onClick, isAsc, isActive }: ButtonOrderAscDescProps) {

    return (
        <button onClick={onClick} className={`w-10 h-10 flex items-center justify-center ${isActive ? "text-blue-500" : "text-gray-500"}`}>
            <div
            className="w-full h-full flex flex-col items-center justify-center relative"
            >
            <span
                className="absolute text-[10px] left-1/2 top-2 -translate-x-1/2 w-3 h-3"
                style={{ lineHeight: 1 }}
            >▲</span>
            <span
                className="absolute text-[10px] left-1/2 bottom-2 -translate-x-1/2 w-3 h-3"
                style={{ lineHeight: 1 }}
            >▼</span>
            </div>
        </button>
    );
}