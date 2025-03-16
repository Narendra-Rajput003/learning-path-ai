

<<<<<<< HEAD
import RoadmapClient from './components/RoadmapClient';

async function getRoadmapData(slug: string) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/roadmaps?title=${slug}`, {
    cache: 'no-store'
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch roadmap');
  }

  const data = await response.json();
  return data.data;
}

export default async function RoadmapPage({ params }: { params: { roadmap: string } }) {
  const roadmapData = await getRoadmapData(params.roadmap);
  return <RoadmapClient data={roadmapData} />;
=======



export default function RoadmapPage() {
  return (
    <div>
      <h1>Roadmap Page</h1>
    </div>
  );
>>>>>>> 01f64e06090104b2f09acafcb0dc23e6aee72dd8
}
