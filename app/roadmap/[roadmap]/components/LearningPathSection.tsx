interface LearningItem {
  title: string;
  description: string;
}

interface LearningPathProps {
  learningPath: {
    beginner: LearningItem[];
    intermediate: LearningItem[];
    advanced: LearningItem[];
  };
}

export default function LearningPathSection({ learningPath }: LearningPathProps) {
  if (!learningPath) return null;

  return (
    <section className="py-16 max-w-7xl mx-auto px-4">
      <h2 className="text-3xl font-bold text-white mb-12">Learning Path</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {Object.entries(learningPath).map(([level, items]) => {
          // Ensure items is an array
          const itemsArray = Array.isArray(items) ? items : [];
          
          return (
            <div
              key={level}
              className="bg-white/5 rounded-xl p-6 space-y-6"
            >
              <h3 className="text-xl font-semibold text-white capitalize">{level}</h3>
              <div className="space-y-4">
                {itemsArray.map((item: LearningItem, index: number) => (
                  <div key={index} className="bg-white/5 rounded-lg p-4">
                    <h4 className="text-lg font-medium text-white">{item.title}</h4>
                    <p className="text-gray-400 mt-2">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}