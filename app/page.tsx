import Link from "next/link";
import Spine from "@/components/Spine";
import ScrollReveal from "@/components/ScrollReveal";
import BlogCard from "@/components/BlogCard";
import PlaygroundTile from "@/components/PlaygroundTile";
import { getPublishedPosts } from "@/lib/posts";

export default async function HomePage() {
  const thoughtsPosts = (await getPublishedPosts("thoughts")).slice(0, 3);
  const playgroundPosts = (await getPublishedPosts("playground")).slice(0, 3);

  return (
    <>
      <Spine />
      <ScrollReveal />
      <main className="wrap">
        <section className="hero" id="hero" style={{ borderTop: "none", paddingTop: 80 }}>
          <h1>
            Notes from a<br />
            quiet <span className="gradient-strike">mind</span>{" "}
            <span className="gradient-text handwritten">soul</span>.
          </h1>
          <div className="subtitle">Curious · Reader · Thinker</div>
          <p className="bio">
            A quiet soul building a meaningful life from the ground up. Usually found lost in
            a book, watching people, or quietly engineering his next personal growth blueprint.
          </p>
          <div className="ctas">
            <a className="cta-link" href="#thoughts">Thoughts →</a>
            <a className="cta-link" href="#playground">Playground →</a>
          </div>
        </section>

        <section id="thoughts">
          <div className="section-head reveal">
            <h2>Thoughts</h2>
            <Link className="see-all" href="/thoughts">All thoughts →</Link>
          </div>
          <div className="blog-grid">
            {thoughtsPosts.map((post) => (
              <div className="reveal" key={post.id}>
                <BlogCard post={post} />
              </div>
            ))}
          </div>
        </section>

        <section id="playground">
          <div className="section-head reveal">
            <h2>Playground</h2>
            <Link className="see-all" href="/playground">All of playground →</Link>
          </div>
          <div className="playground-grid">
            {playgroundPosts.map((post) => (
              <div className="reveal" key={post.id}>
                <PlaygroundTile post={post} />
              </div>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
