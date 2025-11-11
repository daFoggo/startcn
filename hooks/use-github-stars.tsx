import { create } from 'zustand';

interface GitHubStarsResponse {
  stargazers_count: number;
}

interface GithubStarsStore {
  stargazersCount: number;
  isLoading: boolean;
  error: Error | null;
  fetchGithubStars: (owner: string, repo: string) => Promise<void>;
}

async function fetchGithubStarsAPI(
  owner: string,
  repo: string
): Promise<GitHubStarsResponse> {
  const response = await fetch(`https://api.github.com/repos/${owner}/${repo}`);
  if (!response.ok) {
    throw new Error("Failed to fetch stargazers count");
  }
  return response.json();
}

export const useGithubStarsStore = create<GithubStarsStore>((set) => ({
  stargazersCount: 0,
  isLoading: false,
  error: null,
  
  fetchGithubStars: async (owner: string, repo: string) => {
    set({ isLoading: true, error: null });
    
    try {
      const data = await fetchGithubStarsAPI(owner, repo);
      set({ 
        stargazersCount: data.stargazers_count,
        isLoading: false 
      });
    } catch (error) {
      set({ 
        error: error as Error,
        isLoading: false 
      });
    }
  },
}));