import DefautPage from "@/components/defautpage";
import dynamic from "next/dynamic";

import ApexCharts from 'apexcharts'
import { ChartLineTime } from "src/components/charts";

export default function PageCarrinho(){
  const ApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });
return (
    <DefautPage>
      <div className="col-span-3 sm:col-span-9">
      <label
        htmlFor="orderid"
        className="titlePage">
        Detalhes Carrinho Abandonado
      </label>

      <ChartLineTime data1={[1,2,3]} data2={[12,32,32]} categories={['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul']} className="blockCharts" children ></ChartLineTime>
      </div>
      </DefautPage>
)
}