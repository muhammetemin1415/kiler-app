import HealthProfileForm from '@/components/forms/HealthProfileForm';

export default function HealthPage() {
  return (
    <div className="p-8">
      <div className="max-w-2xl">
        <h1 className="text-3xl font-bold mb-8">Health & Fitness</h1>
        <HealthProfileForm />
      </div>
    </div>
  );
}
