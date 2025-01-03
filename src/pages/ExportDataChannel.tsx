import ExportData from '../component/ExportData';

const ExportDataChannel = () => {
  return (
    <div className="max-w-screen mt-10 flex min-h-screen flex-col items-center space-y-10 overflow-auto bg-background p-6">
      <ExportData exportType="channel" />
    </div>
  );
};
export default ExportDataChannel;
