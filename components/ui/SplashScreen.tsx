export default function SplashScreen() {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-white z-50">
      <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mb-4" />
      <p className="text-gray-600 text-sm">Spot Clean 로딩 중...</p>
    </div>
  );
}
