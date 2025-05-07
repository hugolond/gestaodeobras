import Link from "next/link";
type linkProps = {
    link : string;
    text : string;
    draw : string;
    className : string;
    children: React.ReactNode;
}

export const BoxText = (props: linkProps) => {
    return (
        <Link href={props.link}
        className= {props.className}>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-6 h-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}>                
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d={props.draw}
                />             
                </svg>
                <span>
                    {props.text}
                </span>                       
        </Link>         
        
             
    );
};
