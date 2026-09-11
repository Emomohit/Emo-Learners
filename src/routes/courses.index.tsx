import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo, useEffect } from "react";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { courses, CATEGORIES } from "@/lib/course-data";
import { getAllProgress, CourseProgress } from "@/lib/course-progress";
import { ArrowRight, Clock, GraduationCap, PlayCircle, Sparkles, Search, Play } from "lucide-react";

export const Route = createFileRoute("/courses/")({
  head: () => ({
    meta: [
      { title: "Free Programming Courses | EMO Learners" },
      { name: "description", content: "Learn Python, Java, C, and DSA for free. Deep-linked YouTube courses with notes and tracking." },
    ],
  }),
  component: CoursesIndex,
});

function CoursesIndex() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedLevel, setSelectedLevel] = useState<string>("All");
  const [progressData, setProgressData] = useState<{slug: string, progress: CourseProgress}[]>([]);

  useEffect(() => {
    setProgressData(getAllProgress());
  }, []);

  const filteredCourses = useMemo(() => {
    return courses.filter((c) => {
      const matchesSearch =
        search === "" ||
        c.title.toLowerCase().includes(search.toLowerCase()) ||
        c.instructor.toLowerCase().includes(search.toLowerCase()) ||
        c.tags?.some((t) => t.toLowerCase().includes(search.toLowerCase()));

      const matchesCategory = selectedCategory === "All" || c.category === selectedCategory;
      const matchesLevel = selectedLevel === "All" || c.level.includes(selectedLevel);

      return matchesSearch && matchesCategory && matchesLevel;
    });
  }, [search, selectedCategory, selectedLevel]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section className="border-b border-border px-6 pb-16 pt-16 md:pt-24 bg-surface/10 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
        <div className="mx-auto max-w-6xl text-center relative z-10 animate-rise">
          <span className="inline-flex items-center gap-2 border-l-4 border-primary pl-3 font-mono text-[11px] font-bold uppercase tracking-widest text-primary">
            <Sparkles className="h-3 w-3" /> Free · Notes · Quizzes · Exercises
          </span>
          <h1 className="mt-6 font-display text-5xl font-bold leading-[0.98] md:text-7xl">
            Master the craft.
            <br />
            <span className="text-primary">From zero to ship.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base text-muted-foreground md:text-lg">
            Complete YouTube courses enhanced with structured chapters, notes, and progress tracking. 
            No fluff, no paywall, just pure learning.
          </p>
        </div>
      </section>

      {/* Continue Learning Section */}
      {progressData.length > 0 && (
        <section className="px-6 py-12 border-b border-border bg-surface/30">
          <div className="mx-auto max-w-6xl">
            <h2 className="font-display text-2xl font-bold mb-6 flex items-center gap-2">
              <PlayCircle className="h-6 w-6 text-primary" /> Continue Learning
            </h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {progressData.slice(0, 3).map(({ slug, progress }) => {
                const c = courses.find((c) => c.slug === slug);
                if (!c) return null;
                const lastChapter = c.chapters.find(ch => ch.id === progress.lastChapterId) || c.chapters[0];
                return (
                  <Link 
                    key={slug} 
                    to={`/courses/${slug}`}
                    className="group panel p-5 rounded-2xl transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="text-4xl">{c.emoji}</div>
                      <div className="text-right">
                        <div className="text-xs font-bold text-primary">{progress.percentage}% Done</div>
                        <div className="text-[10px] text-muted-foreground uppercase tracking-wider">{progress.completedChapters.length} / {c.chapters.length} chapters</div>
                      </div>
                    </div>
                    <h3 className="font-bold text-lg leading-tight mb-1">{c.title}</h3>
                    <p className="text-sm text-muted-foreground truncate mb-4">
                      Up next: Chapter {lastChapter.id} - {lastChapter.title}
                    </p>
                    <div className="w-full bg-surface h-1.5 rounded-full overflow-hidden mb-4">
                      <div className="bg-primary h-full transition-all duration-500" style={{ width: `${progress.percentage}%` }} />
                    </div>
                    <button className="w-full py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-transform active:scale-95">
                      <Play className="h-3.5 w-3.5 fill-current" /> Resume
                    </button>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Main Course Library */}
      <section className="px-6 py-16 flex-1">
        <div className="mx-auto max-w-6xl">
          
          {/* Filters Bar */}
          <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center mb-10">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input 
                type="text" 
                placeholder="Search courses, topics, instructors..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-surface/50 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow"
              />
            </div>
            
            <div className="flex items-center gap-3 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 hide-scrollbar">
              <select 
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-surface border border-border rounded-lg px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/50 cursor-pointer"
              >
                <option value="All">All Categories</option>
                {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
              <select 
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="bg-surface border border-border rounded-lg px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/50 cursor-pointer"
              >
                <option value="All">All Levels</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
          </div>

          {/* Grid */}
          {filteredCourses.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredCourses.map((c, i) => {
                // For playlist courses with no main videoId, we can grab the first chapter's videoId for the thumbnail
                const thumbVideoId = c.videoId || c.chapters[0]?.videoId || "dQw4w9WgXcQ";
                const thumbnailUrl = `https://img.youtube.com/vi/${thumbVideoId}/hqdefault.jpg`;
                const isStarted = progressData.some(p => p.slug === c.slug);

                return (
                  <Link
                    key={c.slug}
                    to={`/courses/${c.slug}`}
                    className="group flex flex-col overflow-hidden panel panel-hover animate-rise rounded-2xl border border-border bg-surface/20"
                    style={{ animationDelay: `${i * 50}ms` }}
                  >
                    {/* Thumbnail Area */}
                    <div className="relative aspect-video w-full overflow-hidden bg-surface">
                      <img 
                        src={thumbnailUrl} 
                        alt={c.title} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80" />
                      <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md border border-white/10 rounded-lg px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-white">
                        {c.category.split(' ')[0]} {/* Short category name */}
                      </div>
                      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white/90 text-xs font-medium">
                        <span className="flex items-center gap-1.5"><PlayCircle className="h-4 w-4" /> {c.chapters.length} Chapters</span>
                        {isStarted && <span className="bg-primary/90 text-primary-foreground px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">In Progress</span>}
                      </div>
                    </div>

                    {/* Content Area */}
                    <div className="p-5 flex flex-col flex-1">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-2xl leading-none">{c.emoji}</span>
                        <h3 className="font-display text-xl font-bold tracking-tight line-clamp-1 group-hover:text-primary transition-colors">{c.title}</h3>
                      </div>
                      
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-5 flex-1">
                        {c.description}
                      </p>
                      
                      <div className="flex flex-wrap gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground mt-auto">
                        <span className="inline-flex items-center gap-1 bg-surface/50 rounded-md px-2 py-1">
                          <GraduationCap className="h-3 w-3" /> {c.level.split(' ')[0]}
                        </span>
                        <span className="inline-flex items-center gap-1 bg-surface/50 rounded-md px-2 py-1">
                          <Clock className="h-3 w-3" /> {c.hours}
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-24 border border-dashed border-border rounded-3xl bg-surface/10">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-surface mb-4">
                <Search className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="font-display text-2xl font-bold mb-2">No courses found</h3>
              <p className="text-muted-foreground">Try adjusting your search or filters to find what you're looking for.</p>
              <button 
                onClick={() => { setSearch(""); setSelectedCategory("All"); setSelectedLevel("All"); }}
                className="mt-6 text-sm font-bold text-primary hover:underline"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
