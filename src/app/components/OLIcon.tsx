import Ic  from "../assets/openlibrary-logo-tighter.svg";
import Image from "next/image";
export default function Ico(){
    return (
        <Image 
        priority
        src={Ic}
        alt="Open Library"
        height={50}/>
    )
}