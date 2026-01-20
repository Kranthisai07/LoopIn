export const CURRENT_USER = {
  name: "Alex Dev",
  handle: "@alex_builds",
  bio: "Full Stack Dev building in public. Love React, Node, and Coffee.",
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
  stats: {
    joined: 12,
    created: 55
  }
};

export const INTERESTS = [
  "AI & ML", "Web Dev", "Game Dev", "Startups", "Design", "Crypto", "Hardware", "Productivity"
];

export const LOOPS = [
  {
    id: 1,
    name: "AI Meme Makers",
    category: "AI & ML",
    members: 1420,
    description: "The intersection of AGI and LMAO. Post your best AI gens.",
    joined: true
  },
  {
    id: 2,
    name: "First-Time Founders",
    category: "Startups",
    members: 890,
    description: "Support group for those 0 to 1 journeys. No judgment.",
    joined: false
  },
  {
    id: 3,
    name: "Undergrad Game Devs",
    category: "Game Dev",
    members: 340,
    description: "Unity, Unreal, Godot. Show your WIPs.",
    joined: false
  },
  {
    id: 4,
    name: "Indie Hackers NYC",
    category: "Startups",
    members: 210,
    description: "Local meetups and co-working for NYC builders.",
    joined: true
  },
  {
    id: 5,
    name: "Rust Evangelists",
    category: "Web Dev",
    members: 12000,
    description: "Rewrite it in Rust. That is all.",
    joined: false
  }
];

export const POSTS = [
  {
    id: 101,
    loopId: 1,
    user: { name: "Sarah AI", handle: "@sarah_gpt", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah" },
    content: "Just got Midjourney to generate a cat eating spaghetti, but the spaghetti is code. 🍝💻 #AIArt",
    likes: 45,
    time: "2h ago"
  },
  {
    id: 102,
    loopId: 4,
    user: { name: "Mike Builder", handle: "@mike_builds", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike" },
    content: "Hit $100 MRR today on my SaaS! It ain't much, but it's honest work. 🚀",
    likes: 120,
    time: "4h ago"
  },
  {
    id: 103,
    loopId: 1,
    user: { name: "Davide", handle: "@dvd", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Davide" },
    content: "Should we allow GPT-3 posts? Discuss.",
    likes: 12,
    time: "5h ago",
    type: 'discussion'
  },
  {
    id: 104,
    loopId: 2,
    user: { name: "Jenny", handle: "@jenny_f", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jenny" },
    content: "Anyone know a good lawyer for incorporating in Delaware? 📝",
    likes: 8,
    time: "1d ago",
    type: 'question'
  },
  {
    id: 105,
    loopId: 3,
    user: { name: "Tariq K", handle: "@tariq_dev", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Tariq" },
    content: "Building a roguelike in Godot. Need a pixel artist for paid collaboration! 🎨👾",
    likes: 24,
    time: "2h ago",
    type: 'collab'
  },
  {
    id: 106,
    loopId: 1,
    user: { name: "AI Fan", handle: "@ai_fan", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" },
    content: "Check out this new model I trained on 80s synthwave covers. 🎵",
    likes: 56,
    time: "30m ago",
    type: 'showcase'
  }
];

export const NEWS_ITEMS = [
  {
    id: 1,
    source: "Economic Times",
    time: "1h ago",
    title: "Celestial Invitation: January 21, 2026",
    summary: "On January 21, 2026, a significant emotional shift occurs, offering renewed hope for Gemini, Scorpio, and Aquarius. For Gemini, clarity returns, reigniting optimism and creativity. Scorpio experiences emotional healing...",
    image: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8c3RhcnN8ZW58MHx8MHx8fDA%3D",
    category: "News"
  },
  {
    id: 2,
    source: "The Verge",
    time: "2h ago",
    title: "Tech Giants Announce Unified AI Standard",
    summary: "In a historic move, major tech companies have agreed on a universal protocol for AI agent communication, paving the way for a more interconnected digital ecosystem.",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    category: "News"
  },
  {
    id: 3,
    source: "Wired",
    time: "5h ago",
    title: "Deep Dive: The Renaissance of Objective-C?",
    summary: "Why some legacy systems are stubbornly sticking to the past, and why a small group of developers says it's actually a good thing.",
    image: "https://images.unsplash.com/photo-1555099962-4199c345e5dd?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    category: "Articles"
  },
  {
    id: 4,
    source: "Ars Technica",
    time: "1d ago",
    title: "Review: The LoopIn Glass",
    summary: "Is this the AR wearable we've been waiting for? A comprehensive look at the new hardware ecosystem.",
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    category: "Articles"
  }
];
