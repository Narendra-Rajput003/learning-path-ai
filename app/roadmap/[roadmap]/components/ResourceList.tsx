import { Book, Github, Link } from 'lucide-react';

export default function ResourceList({ resources }) {
  if (!resources) return null;

  return (
    <div className="space-y-4">
      <h4 className="text-xl font-semibold text-purple-400">Resources</h4>
      
      {/* Documentation */}
      {resources.documentation?.length > 0 && (
        <div className="space-y-2">
          <h5 className="text-lg font-medium text-white">Documentation</h5>
          <div className="space-y-2">
            {resources.documentation.map((doc) => (
              <a
                key={doc.url}
                href={doc.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Book className="w-4 h-4 text-purple-400" />
                  <span className="text-white">{doc.title}</span>
                </div>
                <p className="text-sm text-gray-400 mt-1">{doc.description}</p>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* GitHub Repos */}
      {resources.githubRepos?.length > 0 && (
        <div className="space-y-2">
          <h5 className="text-lg font-medium text-white">GitHub Repositories</h5>
          <div className="space-y-2">
            {resources.githubRepos.map((repo) => (
              <a
                key={repo.url}
                href={repo.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Github className="w-4 h-4 text-purple-400" />
                  <span className="text-white">{repo.title}</span>
                </div>
                <p className="text-sm text-gray-400 mt-1">{repo.description}</p>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Articles */}
      {resources.articles?.length > 0 && (
        <div className="space-y-2">
          <h5 className="text-lg font-medium text-white">Articles</h5>
          <div className="space-y-2">
            {resources.articles.map((article) => (
              <a
                key={article.url}
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Link className="w-4 h-4 text-purple-400" />
                  <span className="text-white">{article.title}</span>
                </div>
                <p className="text-sm text-gray-400 mt-1">{article.description}</p>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}



