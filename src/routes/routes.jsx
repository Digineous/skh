import React from "react";
import { HashRouter as Router, Route, Routes } from "react-router-dom";
import Sidebar from "../components/sidebar";
import Login from "../components/Login";
import Rawpathrediope from "../components/Rawpathrediope copy";
import JSPLEManagement from "../components/jsplenergymanagement";
import JSPLVibration from "../components/jsplvibrations";
import LinamarDashboard from "../components/LinamarDashboard";
import Threshold from "../components/Threshold";
import TabularDashboard from "../components/TabularDashboard";
import IconicDashboard from "../components/IconicViewJSPL";
import VehicleTracking from "../components/VehcileTracking";
import StandardOEE from "../components/StandardOEE";
import StandardCBM from "../components/StandardCBM";
import StandardEMS from "../components/StandardEMS";
import Welcome from "../components/welcome";
// import StandardOEE2 from "../components/StandardOEE2";
import GanttChartComponent from "../components/MachineChart";
import OeeCockpitView from "../components/OeeCockpitView";
import StandardEMS2 from "../components/StandardEMS2";
import PowerEnergyDashboard from "../components/Standard Dashboard/PowerAndEnergyTable";
import GhaziabadOpe from "../components/Method/ghaziabadope";
import PlantMaster from "../components/Administrative/plantmaster";
import MachineMaster from "../components/Administrative/machinemaster";
import ShiftMaster from "../components/Administrative/shiftmaster";
import HolidayList from "../components/Administrative/holidaylist";
import PartMaster from "../components/Production Master/partmaster";
import ChangeOverMaster from "../components/Production Master/changeovermaster";
import UnknownLoss from "../components/Production Master/unknownloss";
import QualityRejection from "../components/Production Master/qualityrejection";
import MachineInput from "../components/Production Master/machineinput";
import DailyReportM1 from "../components/Method/Reports/dailyreportm1";
import WeeklyReportM1 from "../components/Method/Reports/weeklyreportm1";
import MonthlyReportM1 from "../components/Method/Reports/monthlyreportm1";
import YearlyReportM1 from "../components/Method/Reports/yearlyreportm1";
import COntrolRoom from "../components/Administrative/controlroom";
import QuaterlyReportM1 from "../components/Method/Reports/quaterlyreportm1";
import HourlyBucketM1 from "../components/Method/Reports/hourlybucket_m1";
import DefectivePartEntry from "../components/DefectivePartEntry";
import DefectivePartReport from "../components/DefectivePartReport";
import DownTimeEntry from "../components/DownTimeEntry";
import LineMaster from "../components/Administrative/LineMaster";
import DeviceMaster from "../components/Administrative/DeviceMaster";
import PowerReport from "../components/RawData/PowerReport";
import HomePage from '../components/SmartDMTA/Homs';
import KYCCapture from '../components/SmartDMTA/KYCCapture';
import ElectricityzBIllInsight from '../components/SmartDMTA/ElectricityBillInsight';
import CVExtractor from '../components/SmartDMTA/CVExtractor';
import InvoiceMatching from "../components/SmartDMTA/InvoiceMatcing";
import Prewelcome from "../components/prewelcome";
import OEEReport from "../components/OEEReport";

export default function MyRoutes() {
  return (
    <Routes>
      <Route path="/sidebar" element={<Sidebar />} />
      <Route path="/login" element={<Login />} />
      <Route path="" element={<Login />} />
      <Route path="/demoemanagement" element={<JSPLEManagement />} />
      <Route path="/vehicletracking" element={<VehicleTracking />} />
      <Route path="/standarddashboard/oee" element={<StandardOEE />} />
      <Route path="/standarddashboard/cbm" element={<StandardCBM />} />
      <Route path="/standarddashboard/ems" element={<StandardEMS />} />
      <Route path="/standarddashboard/ems2" element={<StandardEMS2 />} />
      <Route
        path="/standarddashboard/dailyviewP&E"
        element={<PowerEnergyDashboard />}
      />
      <Route path="/welcome" element={<Welcome />} />
      <Route path="/machinestatus" element={<GanttChartComponent />} />
      <Route path="/cockpitview" element={<OeeCockpitView />} />
      <Route path="/demovibration" element={<JSPLVibration />} />
      <Route path="/dashboard" element={<LinamarDashboard />} />
      <Route path="/rawdata" element={<Rawpathrediope />} />
      <Route path="/threshold" element={<Threshold />} />
      <Route path="/tabulardashboard" element={<TabularDashboard />} />
      <Route path="/iconicdashboard" element={<IconicDashboard />} />
      <Route path="/method/ope" element={<GhaziabadOpe />} />
      <Route path="/administrative/plantmaster" element={<PlantMaster />} />
      <Route path="/administrative/machinemaster" element={<MachineMaster />} />
      <Route path="/administrative/shiftmaster" element={<ShiftMaster />} />
      <Route path="/administrative/holidayslist" element={<HolidayList />} />
      <Route path="/administrative/devicestatus" element={<COntrolRoom />} />
      <Route path="/administrative/devicemaster" element={<DeviceMaster />} />
      <Route path="/production/partmaster" element={<PartMaster />} />
      <Route path="/administrative/linemaster" element={<LineMaster />} />
      <Route path="/production/changeom" element={<ChangeOverMaster />} />
      <Route path="/production/unknownloss" element={<UnknownLoss />} />
      <Route path="/production/qualityrejection" element={<QualityRejection />} />
      <Route path="/production/machineInput" element={<MachineInput />} />
      <Route path="/reports/hourly" element={<HourlyBucketM1 />} />
      <Route path="/reports/daily" element={<DailyReportM1 />} />
      <Route path="/reports/weekly" element={<WeeklyReportM1 />} />
      <Route path="/reports/monthly" element={<MonthlyReportM1 />} />
      <Route path="/reports/quaterly" element={<QuaterlyReportM1 />} />
      <Route path="/reports/yearly" element={<YearlyReportM1 />} />
      <Route path="/production/downtime/DtEntry" element={<DownTimeEntry />} />
      <Route path="/production/defective/report" element={<DefectivePartReport />} />
      <Route path="/production/defective/entry" element={<DefectivePartEntry />} />
      <Route path="/report/power" element={<PowerReport />} />
      <Route path="/prewelcome" element={<Prewelcome />} />
      <Route path="/oeeReport" element={<OEEReport />} />
      <Route path="/dmta/home" element={<HomePage/>}/>
            <Route path="/dmta/kyccapture" element={<KYCCapture/>}/>
            <Route path="/dmta/ebillinsight" element={<ElectricityzBIllInsight/>}/>
            <Route path="/dmta/cvextraction" element={<CVExtractor/>}/>
            <Route path="/dmta/invoicematching" element={<InvoiceMatching/>}/>

    </Routes>
  );
}
