// Technical Interview Data - Coding Challenges and Questions

export interface CodingChallenge {
  id: string;
  title: string;
  difficulty: 'easy' | 'medium' | 'hard';
  description: string;
  examples: Array<{
    input: string;
    output: string;
    explanation?: string;
  }>;
  constraints: string[];
  starterCode: {
    [language: string]: string;
  };
  testCases: Array<{
    input: string;
    expectedOutput: string;
    hidden?: boolean;
  }>;
  hints: string[];
  timeLimit: number; // in minutes
  category: string;
  companies: string[];
  relatedTopics: string[];
}

export const codingChallenges: CodingChallenge[] = [
  {
    id: 'two-sum',
    title: 'Two Sum',
    difficulty: 'easy',
    description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution, and you may not use the same element twice. You can return the answer in any order.',
    examples: [
      {
        input: 'nums = [2,7,11,15], target = 9',
        output: '[0,1]',
        explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].'
      },
      {
        input: 'nums = [3,2,4], target = 6',
        output: '[1,2]'
      },
      {
        input: 'nums = [3,3], target = 6',
        output: '[0,1]'
      }
    ],
    constraints: [
      '2 <= nums.length <= 10^4',
      '-10^9 <= nums[i] <= 10^9',
      '-10^9 <= target <= 10^9',
      'Only one valid answer exists.'
    ],
    starterCode: {
      javascript: `function twoSum(nums, target) {
    // Your code here

}`,
      python: `def twoSum(nums, target):
    # Your code here
    pass`,
      java: `public int[] twoSum(int[] nums, int target) {
    // Your code here

}`,
      cpp: `vector<int> twoSum(vector<int>& nums, int target) {
    // Your code here

}`
    },
    testCases: [
      {
        input: '[2,7,11,15], 9',
        expectedOutput: '[0,1]'
      },
      {
        input: '[3,2,4], 6',
        expectedOutput: '[1,2]'
      },
      {
        input: '[3,3], 6',
        expectedOutput: '[0,1]'
      },
      {
        input: '[-1,-2,-3,-4,-5], -8',
        expectedOutput: '[2,4]',
        hidden: true
      }
    ],
    hints: [
      'Think about what data structure would allow you to efficiently find complements.',
      'A hash map can be used to store numbers and their indices as you iterate.',
      'For each number, check if its complement (target - current number) exists in the hash map.'
    ],
    timeLimit: 15,
    category: 'Array',
    companies: ['Amazon', 'Google', 'Facebook', 'Microsoft', 'Apple'],
    relatedTopics: ['Hash Table', 'Array']
  },
  {
    id: 'valid-parentheses',
    title: 'Valid Parentheses',
    difficulty: 'easy',
    description: 'Given a string s containing just the characters "(", ")", "{", "}", "[" and "]", determine if the input string is valid. An input string is valid if: Open brackets must be closed by the same type of brackets, and open brackets must be closed in the correct order.',
    examples: [
      {
        input: 's = "()"',
        output: 'true'
      },
      {
        input: 's = "()[]{}"',
        output: 'true'
      },
      {
        input: 's = "(]"',
        output: 'false'
      },
      {
        input: 's = "([)]"',
        output: 'false'
      },
      {
        input: 's = "{[]}"',
        output: 'true'
      }
    ],
    constraints: [
      '1 <= s.length <= 10^4',
      's consists of parentheses only "()[]{}".'
    ],
    starterCode: {
      javascript: `function isValid(s) {
    // Your code here

}`,
      python: `def isValid(s):
    # Your code here
    pass`,
      java: `public boolean isValid(String s) {
    // Your code here

}`,
      cpp: `bool isValid(string s) {
    // Your code here

}`
    },
    testCases: [
      {
        input: '"()"',
        expectedOutput: 'true'
      },
      {
        input: '"()[]{}"',
        expectedOutput: 'true'
      },
      {
        input: '"(]"',
        expectedOutput: 'false'
      },
      {
        input: '"([)]"',
        expectedOutput: 'false'
      },
      {
        input: '"{[]}"',
        expectedOutput: 'true'
      }
    ],
    hints: [
      'Use a stack data structure to keep track of opening brackets.',
      'When you encounter a closing bracket, check if it matches the most recent opening bracket.',
      'The string is valid if the stack is empty at the end.'
    ],
    timeLimit: 20,
    category: 'Stack',
    companies: ['Google', 'Amazon', 'Microsoft', 'Bloomberg'],
    relatedTopics: ['Stack', 'String']
  },
  {
    id: 'reverse-linked-list',
    title: 'Reverse Linked List',
    difficulty: 'easy',
    description: 'Given the head of a singly linked list, reverse the list, and return the reversed list.',
    examples: [
      {
        input: 'head = [1,2,3,4,5]',
        output: '[5,4,3,2,1]'
      },
      {
        input: 'head = [1,2]',
        output: '[2,1]'
      },
      {
        input: 'head = []',
        output: '[]'
      }
    ],
    constraints: [
      'The number of nodes in the list is the range [0, 5000].',
      '-5000 <= Node.val <= 5000'
    ],
    starterCode: {
      javascript: `// Definition for singly-linked list.
function ListNode(val, next) {
    this.val = (val===undefined ? 0 : val)
    this.next = (next===undefined ? null : next)
}

function reverseList(head) {
    // Your code here

}`,
      python: `# Definition for singly-linked list.
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def reverseList(head):
    # Your code here
    pass`,
      java: `// Definition for singly-linked list.
public class ListNode {
    int val;
    ListNode next;
    ListNode() {}
    ListNode(int val) { this.val = val; }
    ListNode(int val, ListNode next) { this.val = val; this.next = next; }
}

public ListNode reverseList(ListNode head) {
    // Your code here

}`,
      cpp: `// Definition for singly-linked list.
struct ListNode {
    int val;
    ListNode *next;
    ListNode() : val(0), next(nullptr) {}
    ListNode(int x) : val(x), next(nullptr) {}
    ListNode(int x, ListNode *next) : val(x), next(next) {}
};

ListNode* reverseList(ListNode* head) {
    // Your code here

}`
    },
    testCases: [
      {
        input: '[1,2,3,4,5]',
        expectedOutput: '[5,4,3,2,1]'
      },
      {
        input: '[1,2]',
        expectedOutput: '[2,1]'
      },
      {
        input: '[]',
        expectedOutput: '[]'
      }
    ],
    hints: [
      'Think about using three pointers: prev, current, and next.',
      'You need to break the link and reverse it step by step.',
      'Consider both iterative and recursive approaches.'
    ],
    timeLimit: 25,
    category: 'Linked List',
    companies: ['Facebook', 'Amazon', 'Microsoft', 'Apple'],
    relatedTopics: ['Linked List', 'Recursion']
  },
  {
    id: 'maximum-subarray',
    title: 'Maximum Subarray',
    difficulty: 'medium',
    description: 'Given an integer array nums, find the contiguous subarray (containing at least one number) which has the largest sum and return its sum.',
    examples: [
      {
        input: 'nums = [-2,1,-3,4,-1,2,1,-5,4]',
        output: '6',
        explanation: '[4,-1,2,1] has the largest sum = 6.'
      },
      {
        input: 'nums = [1]',
        output: '1'
      },
      {
        input: 'nums = [5,4,-1,7,8]',
        output: '23'
      }
    ],
    constraints: [
      '1 <= nums.length <= 10^5',
      '-10^4 <= nums[i] <= 10^4'
    ],
    starterCode: {
      javascript: `function maxSubArray(nums) {
    // Your code here

}`,
      python: `def maxSubArray(nums):
    # Your code here
    pass`,
      java: `public int maxSubArray(int[] nums) {
    // Your code here

}`,
      cpp: `int maxSubArray(vector<int>& nums) {
    // Your code here

}`
    },
    testCases: [
      {
        input: '[-2,1,-3,4,-1,2,1,-5,4]',
        expectedOutput: '6'
      },
      {
        input: '[1]',
        expectedOutput: '1'
      },
      {
        input: '[5,4,-1,7,8]',
        expectedOutput: '23'
      }
    ],
    hints: [
      "This is a classic dynamic programming problem (Kadane's algorithm).",
      'At each position, decide whether to start a new subarray or extend the current one.',
      'Keep track of the maximum sum seen so far.'
    ],
    timeLimit: 30,
    category: 'Dynamic Programming',
    companies: ['Amazon', 'Microsoft', 'Apple', 'Google'],
    relatedTopics: ['Array', 'Dynamic Programming', 'Divide and Conquer']
  },
  {
    id: 'binary-tree-inorder',
    title: 'Binary Tree Inorder Traversal',
    difficulty: 'easy',
    description: 'Given the root of a binary tree, return the inorder traversal of its nodes\' values.',
    examples: [
      {
        input: 'root = [1,null,2,3]',
        output: '[1,3,2]'
      },
      {
        input: 'root = []',
        output: '[]'
      },
      {
        input: 'root = [1]',
        output: '[1]'
      }
    ],
    constraints: [
      'The number of nodes in the tree is in the range [0, 100].',
      '-100 <= Node.val <= 100'
    ],
    starterCode: {
      javascript: `// Definition for a binary tree node.
function TreeNode(val, left, right) {
    this.val = (val===undefined ? 0 : val)
    this.left = (left===undefined ? null : left)
    this.right = (right===undefined ? null : right)
}

function inorderTraversal(root) {
    // Your code here

}`,
      python: `# Definition for a binary tree node.
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def inorderTraversal(root):
    # Your code here
    pass`,
      java: `// Definition for a binary tree node.
public class TreeNode {
    int val;
    TreeNode left;
    TreeNode right;
    TreeNode() {}
    TreeNode(int val) { this.val = val; }
    TreeNode(int val, TreeNode left, TreeNode right) {
        this.val = val;
        this.left = left;
        this.right = right;
    }
}

public List<Integer> inorderTraversal(TreeNode root) {
    // Your code here

}`,
      cpp: `// Definition for a binary tree node.
struct TreeNode {
    int val;
    TreeNode *left;
    TreeNode *right;
    TreeNode() : val(0), left(nullptr), right(nullptr) {}
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
    TreeNode(int x, TreeNode *left, TreeNode *right) : val(x), left(left), right(right) {}
};

vector<int> inorderTraversal(TreeNode* root) {
    // Your code here

}`
    },
    testCases: [
      {
        input: '[1,null,2,3]',
        expectedOutput: '[1,3,2]'
      },
      {
        input: '[]',
        expectedOutput: '[]'
      },
      {
        input: '[1]',
        expectedOutput: '[1]'
      }
    ],
    hints: [
      'Inorder traversal visits nodes in the order: left subtree, root, right subtree.',
      'You can solve this recursively or iteratively using a stack.',
      'The recursive solution is straightforward: traverse left, visit root, traverse right.'
    ],
    timeLimit: 25,
    category: 'Tree',
    companies: ['Microsoft', 'Amazon', 'Facebook'],
    relatedTopics: ['Stack', 'Tree', 'Depth-First Search', 'Binary Tree']
  },
  {
    id: 'longest-substring',
    title: 'Longest Substring Without Repeating Characters',
    difficulty: 'medium',
    description: 'Given a string s, find the length of the longest substring without repeating characters.',
    examples: [
      {
        input: 's = "abcabcbb"',
        output: '3',
        explanation: 'The answer is "abc", with the length of 3.'
      },
      {
        input: 's = "bbbbb"',
        output: '1',
        explanation: 'The answer is "b", with the length of 1.'
      },
      {
        input: 's = "pwwkew"',
        output: '3',
        explanation: 'The answer is "wke", with the length of 3.'
      }
    ],
    constraints: [
      '0 <= s.length <= 5 * 10^4',
      's consists of English letters, digits, symbols and spaces.'
    ],
    starterCode: {
      javascript: `function lengthOfLongestSubstring(s) {
    // Your code here

}`,
      python: `def lengthOfLongestSubstring(s):
    # Your code here
    pass`,
      java: `public int lengthOfLongestSubstring(String s) {
    // Your code here

}`,
      cpp: `int lengthOfLongestSubstring(string s) {
    // Your code here

}`
    },
    testCases: [
      {
        input: '"abcabcbb"',
        expectedOutput: '3'
      },
      {
        input: '"bbbbb"',
        expectedOutput: '1'
      },
      {
        input: '"pwwkew"',
        expectedOutput: '3'
      },
      {
        input: '""',
        expectedOutput: '0'
      }
    ],
    hints: [
      'Use the sliding window technique with two pointers.',
      'Keep track of characters using a hash set or hash map.',
      'When you find a duplicate, move the left pointer to remove the duplicate.'
    ],
    timeLimit: 35,
    category: 'String',
    companies: ['Amazon', 'Microsoft', 'Facebook', 'Adobe'],
    relatedTopics: ['Hash Table', 'String', 'Sliding Window']
  },
  {
    id: 'merge-intervals',
    title: 'Merge Intervals',
    difficulty: 'medium',
    description: 'Given an array of intervals where intervals[i] = [starti, endi], merge all overlapping intervals, and return an array of the non-overlapping intervals that cover all the intervals in the input.',
    examples: [
      {
        input: 'intervals = [[1,3],[2,6],[8,10],[15,18]]',
        output: '[[1,6],[8,10],[15,18]]',
        explanation: 'Since intervals [1,3] and [2,6] overlaps, merge them into [1,6].'
      },
      {
        input: 'intervals = [[1,4],[4,5]]',
        output: '[[1,5]]',
        explanation: 'Intervals [1,4] and [4,5] are considered overlapping.'
      }
    ],
    constraints: [
      '1 <= intervals.length <= 10^4',
      'intervals[i].length == 2',
      '0 <= starti <= endi <= 10^4'
    ],
    starterCode: {
      javascript: `function merge(intervals) {
    // Your code here

}`,
      python: `def merge(intervals):
    # Your code here
    pass`,
      java: `public int[][] merge(int[][] intervals) {
    // Your code here

}`,
      cpp: `vector<vector<int>> merge(vector<vector<int>>& intervals) {
    // Your code here

}`
    },
    testCases: [
      {
        input: '[[1,3],[2,6],[8,10],[15,18]]',
        expectedOutput: '[[1,6],[8,10],[15,18]]'
      },
      {
        input: '[[1,4],[4,5]]',
        expectedOutput: '[[1,5]]'
      },
      {
        input: '[[1,4],[0,4]]',
        expectedOutput: '[[0,4]]',
        hidden: true
      }
    ],
    hints: [
      'First, sort the intervals by their start times.',
      'Then iterate through and merge overlapping intervals.',
      'Two intervals overlap if the start of the second is less than or equal to the end of the first.'
    ],
    timeLimit: 40,
    category: 'Array',
    companies: ['Facebook', 'Google', 'Microsoft', 'Bloomberg'],
    relatedTopics: ['Array', 'Sorting']
  },
  {
    id: 'climbing-stairs',
    title: 'Climbing Stairs',
    difficulty: 'easy',
    description: 'You are climbing a staircase. It takes n steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?',
    examples: [
      {
        input: 'n = 2',
        output: '2',
        explanation: 'There are two ways to climb to the top. 1. 1 step + 1 step 2. 2 steps'
      },
      {
        input: 'n = 3',
        output: '3',
        explanation: 'There are three ways to climb to the top. 1. 1 step + 1 step + 1 step 2. 1 step + 2 steps 3. 2 steps + 1 step'
      }
    ],
    constraints: [
      '1 <= n <= 45'
    ],
    starterCode: {
      javascript: `function climbStairs(n) {
    // Your code here

}`,
      python: `def climbStairs(n):
    # Your code here
    pass`,
      java: `public int climbStairs(int n) {
    // Your code here

}`,
      cpp: `int climbStairs(int n) {
    // Your code here

}`
    },
    testCases: [
      {
        input: '2',
        expectedOutput: '2'
      },
      {
        input: '3',
        expectedOutput: '3'
      },
      {
        input: '4',
        expectedOutput: '5'
      },
      {
        input: '5',
        expectedOutput: '8'
      }
    ],
    hints: [
      'This is a classic Fibonacci sequence problem.',
      'To reach step n, you can come from step n-1 (1 step) or step n-2 (2 steps).',
      'Use dynamic programming to avoid recalculating the same subproblems.'
    ],
    timeLimit: 20,
    category: 'Dynamic Programming',
    companies: ['Adobe', 'Apple', 'Amazon'],
    relatedTopics: ['Math', 'Dynamic Programming', 'Memoization']
  }
];

// System Design Questions for Technical Interviews
export interface SystemDesignQuestion {
  id: string;
  title: string;
  difficulty: 'easy' | 'medium' | 'hard';
  description: string;
  keyComponents: string[];
  considerations: string[];
  followUpQuestions: string[];
  timeLimit: number; // in minutes
  level: 'junior' | 'mid' | 'senior' | 'staff';
}

export const systemDesignQuestions: SystemDesignQuestion[] = [
  {
    id: 'url-shortener',
    title: 'Design a URL Shortener (like bit.ly)',
    difficulty: 'medium',
    description: 'Design a URL shortening service like bit.ly that can shorten long URLs and redirect users to the original URLs when accessed.',
    keyComponents: [
      'URL encoding/decoding service',
      'Database for storing URL mappings',
      'Caching layer for popular URLs',
      'Rate limiting',
      'Analytics and monitoring',
      'Load balancer',
      'CDN for global access'
    ],
    considerations: [
      'Scalability - handle millions of URLs',
      'Availability - 99.9% uptime',
      'Consistency vs. Availability tradeoffs',
      'URL collision handling',
      'Custom alias support',
      'Expiration policies',
      'Security (malicious URL detection)'
    ],
    followUpQuestions: [
      'How would you handle 100M URLs per day?',
      'How would you implement analytics?',
      'How would you handle URL expiration?',
      'How would you prevent abuse?'
    ],
    timeLimit: 45,
    level: 'mid'
  },
  {
    id: 'chat-system',
    title: 'Design a Chat System (like WhatsApp)',
    difficulty: 'hard',
    description: 'Design a real-time messaging system that supports one-on-one and group chats with features like message delivery, read receipts, and online presence.',
    keyComponents: [
      'WebSocket connections for real-time messaging',
      'Message storage and retrieval',
      'User authentication and authorization',
      'Push notification service',
      'Media file storage and sharing',
      'Message encryption',
      'Presence service (online/offline status)'
    ],
    considerations: [
      'Real-time message delivery',
      'Message ordering and consistency',
      'Handling offline users',
      'Group chat scalability',
      'End-to-end encryption',
      'Media file handling',
      'Cross-platform synchronization'
    ],
    followUpQuestions: [
      'How would you ensure message delivery?',
      'How would you implement end-to-end encryption?',
      'How would you handle group chats with 1000+ members?',
      'How would you sync messages across devices?'
    ],
    timeLimit: 60,
    level: 'senior'
  },
  {
    id: 'news-feed',
    title: 'Design a Social Media News Feed',
    difficulty: 'hard',
    description: 'Design a news feed system for a social media platform that shows users relevant posts from their connections in real-time.',
    keyComponents: [
      'Post creation and storage service',
      'News feed generation service',
      'User relationship service',
      'Ranking algorithm',
      'Caching layer',
      'Image/video storage',
      'Push notification system'
    ],
    considerations: [
      'Feed generation strategies (pull vs push)',
      'Ranking algorithm for post relevance',
      'Handling celebrity users with millions of followers',
      'Real-time updates',
      'Content moderation',
      'Privacy settings',
      'Performance optimization'
    ],
    followUpQuestions: [
      'How would you handle a user with 10M followers?',
      'How would you implement the ranking algorithm?',
      'How would you ensure content freshness?',
      'How would you handle trending topics?'
    ],
    timeLimit: 60,
    level: 'senior'
  },
  {
    id: 'parking-system',
    title: 'Design a Parking Lot System',
    difficulty: 'medium',
    description: 'Design a parking lot management system that can handle different vehicle types, track availability, and manage payments.',
    keyComponents: [
      'Parking spot management',
      'Vehicle entry/exit tracking',
      'Payment processing',
      'Availability monitoring',
      'Reservation system',
      'Pricing calculation',
      'Admin dashboard'
    ],
    considerations: [
      'Different vehicle types and sizes',
      'Spot allocation algorithms',
      'Payment methods and processing',
      'Real-time availability updates',
      'Reservation conflicts',
      'Pricing strategies',
      'System reliability and fault tolerance'
    ],
    followUpQuestions: [
      'How would you handle peak hours?',
      'How would you implement dynamic pricing?',
      'How would you handle system failures?',
      'How would you add mobile app integration?'
    ],
    timeLimit: 40,
    level: 'mid'
  }
];

// Behavioral Interview Questions
export interface BehavioralQuestion {
  id: string;
  question: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  starMethod: {
    situation: string;
    task: string;
    action: string;
    result: string;
  };
  followUpQuestions: string[];
  tips: string[];
  commonMistakes: string[];
}

export const behavioralQuestions: BehavioralQuestion[] = [
  {
    id: 'leadership-challenge',
    question: 'Tell me about a time when you had to lead a team through a difficult project.',
    category: 'Leadership',
    difficulty: 'medium',
    starMethod: {
      situation: 'Describe the project context, team composition, and challenges faced',
      task: 'Explain your responsibility as a leader and what needed to be achieved',
      action: 'Detail the specific leadership actions you took to guide the team',
      result: 'Share the outcome and what you learned about leadership'
    },
    followUpQuestions: [
      'How did you handle team conflicts during this project?',
      'What would you do differently if you faced a similar situation again?',
      'How did you measure the success of your leadership?'
    ],
    tips: [
      'Focus on your leadership style and decision-making process',
      'Highlight how you motivated and supported your team',
      'Show emotional intelligence and adaptability',
      'Quantify the results where possible'
    ],
    commonMistakes: [
      'Taking all the credit instead of highlighting team contributions',
      'Not showing vulnerability or learning from mistakes',
      'Focusing too much on technical details rather than leadership aspects'
    ]
  },
  {
    id: 'conflict-resolution',
    question: 'Describe a situation where you had to work with a difficult colleague or stakeholder.',
    category: 'Conflict Resolution',
    difficulty: 'medium',
    starMethod: {
      situation: 'Set the context for the conflict without being negative about the person',
      task: 'Explain what needed to be accomplished despite the difficulties',
      action: 'Describe your approach to managing the relationship and resolving conflicts',
      result: 'Share the outcome and any improvements in the working relationship'
    },
    followUpQuestions: [
      'How do you typically handle disagreements in the workplace?',
      'What strategies do you use to understand different perspectives?',
      'How do you maintain professionalism when emotions run high?'
    ],
    tips: [
      'Remain professional and avoid personal attacks',
      'Show empathy and understanding of different perspectives',
      'Focus on problem-solving rather than blame',
      'Demonstrate emotional maturity and communication skills'
    ],
    commonMistakes: [
      'Speaking negatively about colleagues or being unprofessional',
      'Not taking any responsibility for the conflict',
      'Focusing on personality clashes rather than work-related issues'
    ]
  },
  {
    id: 'innovation-creativity',
    question: 'Tell me about a time when you came up with an innovative solution to a problem.',
    category: 'Innovation',
    difficulty: 'medium',
    starMethod: {
      situation: 'Describe the problem or challenge that required creative thinking',
      task: 'Explain what needed to be solved and any constraints you faced',
      action: 'Detail your creative process and the innovative solution you developed',
      result: 'Share the impact of your solution and any broader applications'
    },
    followUpQuestions: [
      'How do you typically approach problems that don\'t have obvious solutions?',
      'What inspires your creativity in the workplace?',
      'How do you balance innovation with practical constraints?'
    ],
    tips: [
      'Showcase your problem-solving methodology',
      'Highlight your ability to think outside the box',
      'Demonstrate how you validate and implement creative ideas',
      'Show the measurable impact of your innovation'
    ],
    commonMistakes: [
      'Claiming sole credit for team innovations',
      'Not explaining the thought process behind the solution',
      'Focusing on ideas that were never implemented or tested'
    ]
  }
];

export default {
  codingChallenges,
  systemDesignQuestions,
  behavioralQuestions
};
