import Form from "@/components/form";
import Image from "next/image";
import bg from '../../public/tela1.png'
import logo from '../assets/marca.png'

const styling = {
  backgroundImage: `url('${bg.src}')`,
  width: '100%',
  height: '100%',
  flex: 2.8,
}

export default function Login() {
  return (
    <section className="login">
    <div className="hidden sm:block no-repeat left fixed bg-cover" style={styling}/>
    <div className="flex flex-col items-center justify-center z-10 h-max sm:h-full sm:fixed sm:right-0 space-y-3 border-b rounded-s-2xl border-gray-200 bg-[#2C3E50] px-7 py-7 pt-7 border shadow-xl">                     
          <div className="bg-white rounded-lg bg-white shadow-xl">
          <Image alt="" src={logo} width="200"/>
          </div>
          
          <p className="text-sm text-gray-200">
            Informe email e senha para continuar
          </p>
          <Form type="login" />
      </div>
    </section>
  );
}
