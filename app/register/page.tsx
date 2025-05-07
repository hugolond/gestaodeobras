import Form from "@/components/form";

export default function Login() {
  return (    
    <section className="login ">
        <div className="flex flex-col items-center justify-center space-y-3 border-b rounded-2xl border-gray-200 bg-white px-6 py-6 pt-6 border shadow-xl">                             
          <h3 className="text-xl font-semibold">Registre-se</h3>
          <p className="text-sm text-gray-500">
            Preencha os dados abaixo para reealizar o cadastro
          </p>        
      <Form type="register" />
      </div>
    </section>
  );
}
