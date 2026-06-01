import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="text-center">
        <div className="text-8xl font-bold text-primary/20 mb-4">৪০৪</div>
        <h1 className="text-2xl font-bold text-gray-700 mb-2">পেজটি পাওয়া যায়নি</h1>
        <p className="text-gray-500 mb-6 text-sm">আপনি যে পেজটি খুঁজছেন সেটি বিদ্যমান নেই বা সরানো হয়েছে।</p>
        <Link href="/" className="btn-primary">হোম পেজে যান</Link>
      </div>
    </div>
  );
}
