# 🎓 DSA PREP HUB – University Exam Preparation Platform

A modern, production-ready, responsive Data Structures & Algorithms preparation web application engineered specifically for university students preparing for internal unit tests, evaluations, and end-semester university examinations.

---

## 🌟 Key Features

1. **Curated 5-Unit University Question Bank (61 Questions)**:
   - **Original University Questions (Q1 to Q21)**: Extracted verbatim from college question papers and university answer books with original numbers, importance tags, and source citations.
   - **Added Syllabus Completion Questions (`ADDED – SYLLABUS COMPLETION`)**: Bridging every remaining topic across all 5 units for 100% syllabus coverage.
   - **Dedicated Case Studies (5 Units)**: Practical applications for all 5 units (Employee Records Optimization, Dynamic HR Directory, Backtracking & Job Scheduling, BST vs Linear Search benchmark, and Social Network Influence Analysis).
2. **Beginner-Friendly Structured Answers**:
   - Simple Definition
   - Plain-English Explanation
   - Key Exam Points (bulleted)
   - Visual ASCII / Structured Architecture Diagrams (with one-click copy)
   - Formatted Pseudocode / Algorithms
   - Concrete Examples & Numerical Trace Tables (Quick Sort passes, Radix buckets, Selection Sort passes, Quadratic Probing tables, Infix-to-Postfix traces, Dijkstra relaxation tables)
   - Time and Space Complexity pills
   - University Exam Tips
3. **Live Progress Tracking & Synchronization**:
   - Individual student accounts via Supabase Authentication (Email/Password).
   - Optimistic UI updates with instant progress percentage re-calculation across topics, units, and overall syllabus.
   - Cloud synchronization to Supabase PostgreSQL database with Row Level Security (RLS).
   - Celebratory confetti effects upon mastering units.
4. **Instant Demo Student Mode**:
   - Evaluators and students can test all features instantly with 1-click demo access without waiting for email confirmations.
5. **Global Search, Multi-Filter & Revision Hub**:
   - Search by question title, algorithm, topic, or question number (with `Ctrl + K` shortcut).
   - Filter by: Incomplete, Completed, Very Important (Red), Important (Orange), Practice (Blue), Case Studies (Purple), University Paper, Added Questions.
   - Dedicated "Saved for Revision" bookmarks and "Incomplete Very Important" exam mode.
6. **Responsive Design & Dark Mode**:
   - Optimized for mobile phones, tablets, laptops, and large desktop screens.
   - Smooth light / dark theme toggle with persistent preference.

---

## 🛠️ Technology Stack

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS v4, Lucide React icons
- **State & Animations**: React Context, Canvas-Confetti
- **Backend & Auth**: Supabase Authentication, Supabase PostgreSQL with RLS
- **Deployment**: Vercel (configured with `vercel.json` SPA rewrites)

---

## 📚 Syllabus Structure & Case Studies

| Unit | Title | Topics Covered | Case Study |
| :--- | :--- | :--- | :--- |
| **Unit I** | Searching, Sorting & Hashing | Asymptotic notations, Big-O/Ω/Θ, Frequency count, Step-count, Linear/Binary search, Bubble/Insertion/Selection/Merge/Quick/Radix sort, Hash tables, Linear/Quadratic probing, Chaining, Double hashing | **Employee Records Database Optimization**: Finding employees by salary using binary search and sorting by department. |
| **Unit II** | Memory Allocation & Linked Lists | Static vs dynamic memory (`malloc`, `calloc`, `realloc`, `free`), Singly Linked List ADT, Node operations, Doubly Linked List, Circular Linked Lists, Polynomial addition, Generalized Linked List (GLL) | **Dynamic Enterprise HR Directory**: Growing employee database dynamically using linked lists without array reallocation. |
| **Unit III** | Stacks and Queues | Stack ADT (array & linked), Infix/Prefix/Postfix conversions, Postfix evaluation, Recursion execution on Call Stack, Queue ADT, False Overflow, Circular Queue, Deque, Priority Queue | **Backtracking & OS Job Scheduling**: Maze solving with stacks and operating system real-time priority job scheduling. |
| **Unit IV** | Trees | Tree terminology, Binary trees, Inorder/Preorder/Postorder/Level-order traversals, BST Search/Insert/Delete, Threaded Binary Trees, OBST, AVL Trees (LL, RR, LR, RL rotations), Heap Trees & Heap Sort | **BST Search vs Linear Search**: Algorithmic complexity comparison on 1,000,000 record benchmarks. |
| **Unit V** | Graphs | Adjacency Matrix vs Adjacency List, DFS, BFS, Minimum Spanning Trees (Prim's & Kruskal's), Shortest Paths (Dijkstra & Floyd-Warshall), Topological Ordering (Kahn's DAG sort) | **Social Network Interaction Analysis**: Graph modeling of users, friendships, degrees of separation, and influencers. |

---

## 🚀 Local Development Setup

### 1. Prerequisites
- Node.js (v18 or higher; tested on v25)
- npm or pnpm

### 2. Installation
```bash
# Clone the repository
git clone <repository-url>
cd DS

# Install dependencies
npm install
```

### 3. Environment Variables
Create a `.env` file in the project root:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
VITE_APP_NAME="DSA Prep Hub"
VITE_APP_COLLEGE="University Engineering Department"
```

### 4. Run Development Server
```bash
npm run dev
```
Open your browser at `http://localhost:5173`.

---

## 🗄️ Database Setup (Supabase PostgreSQL)

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard) and open the **SQL Editor**.
2. Copy and execute the contents of `supabase/schema.sql`:
   - Creates `profiles`, `question_progress`, and `user_bookmarks` tables.
   - Configures unique constraints (`user_id + question_id`).
   - Enables **Row Level Security (RLS)** ensuring students only read/modify their own records.
   - Sets up automatic profile creation trigger on signup.

---

## 🌐 Deploying to Vercel (Step-by-Step Guide)

1. Push your project to a GitHub repository:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Production-ready DSA Prep Hub"
   git branch -M main
   git remote add origin https://github.com/<your-username>/dsa-prep-hub.git
   git push -u origin main
   ```
2. Go to [Vercel](https://vercel.com) and click **"Add New Project"**.
3. Import your GitHub repository `dsa-prep-hub`.
4. Under **Environment Variables**, add:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
5. Click **Deploy**. Vercel will build the project using `npm run build` and publish it to a public production URL.
6. In your Supabase Dashboard under **Authentication > URL Configuration**:
   - Add your Vercel deployment URL (e.g. `https://dsa-prep-hub.vercel.app`) to **Site URL** and **Redirect URLs**.
