interface TopicSectionProps {
  title: string;
  topics: Array<{
    title: string;
    description: string;
    keyConcepts?: string[];
  }>;
}

export default function TopicSection({ title, topics }: TopicSectionProps) {
  if (!topics || topics.length === 0) return null;

  return (
    <div className="py-8">
      <h2 className="text-2xl font-bold text-white mb-6">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {topics.map((topic, index) => (
          <div 
            key={index}
            className="bg-white/5 rounded-lg p-6 border border-white/10"
          >
            <h3 className="text-xl font-semibold text-white mb-2">{topic.title}</h3>
            <p className="text-gray-400">{topic.description}</p>
            {topic.keyConcepts && topic.keyConcepts.length > 0 && (
              <div className="mt-4">
                <div className="flex flex-wrap gap-2">
                  {topic.keyConcepts.map((concept, i) => (
                    <span
                      key={i}
                      className="px-2 py-1 text-xs rounded-full bg-purple-500/20 text-purple-300"
                    >
                      {concept}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}