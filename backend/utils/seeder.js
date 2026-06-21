import Blog from "../models/blog.model.js";
import User from "../models/user.model.js";

/**
 * Automatically seeds the database with high-quality software engineering,
 * AI, and cloud systems articles if no blogs exist.
 */
export async function seedDatabase() {
  try {
    const blogCount = await Blog.countDocuments();
    if (blogCount > 0) {
      console.log("Database already contains blogs. Skipping seeding...");
      return;
    }

    console.log("Empty database detected. Seeding developer blogs...");

    // Find or create a default developer/blogger account to assign ownership
    let defaultAuthor = await User.findOne();
    if (!defaultAuthor) {
      defaultAuthor = await User.create({
        fullName: "Alex Fenixo",
        email: "alex@setublog.dev",
        password: "password123",
        gender: "male",
        role: "User"
      });
      console.log("Created default developer author account: alex@setublog.dev");
    }

    const mockBlogs = [
      {
        title: "Decentralized Inference: The Next Phase of LLM Scalability",
        description: "How developers are moving past monolithic GPU clusters to run large language models on decentralized grids using pipeline parallelism and advanced quantization.",
        category: "AI",
        image: "https://images.unsplash.com/photo-1677442136019-21780efad99a?q=80&w=1200&auto=format&fit=crop",
        createdby: defaultAuthor._id,
        content: `
          <h2>TheMonolith is Cracking</h2>
          <p>Running inference on Large Language Models (LLMs) like Llama-3-70B or Mixtral 8x22B has historically required massive, expensive monolithic GPU clusters (typically 8x A100/H100 rigs locked behind restrictive cloud VPCs). However, a silent revolution is happening in open-source systems. Developers are breaking the monolith and distributing model layers across heterogeneous, decentralized consumer node grids.</p>
          
          <h2>How Decentralized Inference Works</h2>
          <p>To run a 70-billion-parameter model over nodes with varying GPU memory sizes (e.g. RTX 3090s, RTX 4090s, or even Mac Studios with unified memory), systems utilize a combination of two cutting-edge architectural patterns:</p>
          
          <ul>
            <li><strong>Advanced Quantization (AWQ/GPTQ)</strong>: Shrinking 16-bit float weights into 4-bit or 8-bit precision, reducing memory footprint by up to 75% with negligible accuracy loss. A 70B model that usually takes 140GB VRAM can be compressed into a tight 38GB envelope.</li>
            <li><strong>Pipeline Parallelism (PP)</strong>: Dividing the model's 80+ transformer layers into sequential blocks, feeding them to nodes in a ring structure. Node A processes layers 1-20, sends intermediate activations to Node B (layers 21-40), and so on.</li>
          </ul>

          <h2>The Code: Inter-Node Layer Offloading</h2>
          <p>Below is a conceptual snippet showing how layers are mapped and executed sequentially over a distributed P2P node pipeline:</p>
          
          <pre><code>// Distributed pipeline controller
class DistributedInferencePipeline {
  constructor(peers, modelLayers) {
    this.peers = peers; // List of connected node client sockets
    this.layers = modelLayers;
  }

  async forwardPass(inputTokens) {
    let currentActivations = inputTokens;
    
    for (let i = 0; i < this.peers.length; i++) {
      const peer = this.peers[i];
      console.log(\`[Pipeline] Sending activation buffer to node \${peer.id}...\`);
      
      // Send output activations from layer block N to peer node handling block N+1
      currentActivations = await peer.sendActivations(currentActivations);
    }
    
    return currentActivations; // Final logits
  }
}</code></pre>

          <h2>Overcoming Latency Bottlenecks</h2>
          <p>The single greatest threat to decentralized inference is network communication latency. Waiting for layer activation tensors to travel over standard residential internet connections can destroy Token-Per-Second (TPS) metrics. To solve this, developers are building <strong>tensor-parallel custom transport protocols</strong> over WebRTC/QUIC that bypass standard TCP overheads, achieving fast, responsive consumer-driven AI endpoints.</p>
        `
      },
      {
        title: "Designing Resilient Distributed Systems with CQRS and Event Sourcing",
        description: "An in-depth guide to decoupling your write and read models to achieve ultimate horizontal scalability and historical record durability.",
        category: "Software Engineering",
        image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1200&auto=format&fit=crop",
        createdby: defaultAuthor._id,
        content: `
          <h2>The Database Bottleneck</h2>
          <p>Traditional monolithic applications utilize a single relational database schema for both writing records and rendering complex dashboards. As user traffic grows, this design creates a major architectural bottleneck: complex read joins slow down simple writes, and transaction locks lead to page time-outs. To achieve true scalability, modern systems rely on CQRS and Event Sourcing.</p>
          
          <h2>CQRS: Split the Architecture</h2>
          <p><strong>CQRS (Command Query Responsibility Segregation)</strong> decouples the system into two isolated paths:</p>
          <ul>
            <li><strong>Command Path (Write)</strong>: Focused purely on executing transactions, updating data state, and validating domain business rules. Optimized for high-throughput writes.</li>
            <li><strong>Query Path (Read)</strong>: Optimized for lightning-fast retrieval. Writes replicate data asynchronously to highly de-normalized read-views (e.g. Elasticsearch or Redis caches) designed exactly for UI search grids.</li>
          </ul>

          <h2>Event Sourcing: The Ledger of Truth</h2>
          <p>Instead of saving only the "current state" of a row, <strong>Event Sourcing</strong> saves every single state transition as an immutable chronological ledger of events. State is reconstructed by replaying this log. This is the exact design used by financial ledgers, Git repos, and blockchain nodes.</p>

          <pre><code>// Example command handler creating an immutable event
function handleCreateBlogCommand(commandData) {
  if (!commandData.title) throw new Error("Title is required");

  // Reconstruct event payload
  const event = {
    eventType: "BlogPublishedEvent",
    eventId: uuid.v4(),
    timestamp: new Date(),
    payload: {
      blogId: commandData.id,
      title: commandData.title,
      description: commandData.description,
      content: commandData.content
    }
  };

  // Append to aggregate event stream log
  EventStore.append(event);
  
  // Publish event to message queue (RabbitMQ / Kafka) to sync denormalized Read DB
  MessageBroker.publish("blog-events", event);
}</code></pre>

          <h2>Eventual Consistency is Your Friend</h2>
          <p>While CQRS introduces eventual consistency—meaning the read dashboard might take a few milliseconds to reflect the new article—the separation of read/write loads unlocks unlimited scalability. Reads can scale out horizontally using cheap read-replicas, while writes remain fast, stable, and completely lock-free.</p>
        `
      },
      {
        title: "Kubernetes to Bare-Metal: Why We Repatriated Our Core Stack",
        description: "A detailed look into the performance benchmarks, hypervisor overheads, and financial analysis that led us to move our core SaaS platform off public clouds.",
        category: "IT & Systems",
        image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=1200&auto=format&fit=crop",
        createdby: defaultAuthor._id,
        content: `
          <h2>The Cloud Tax</h2>
          <p>For early-stage startups, public clouds like AWS or GCP are spectacular. They automate physical hardware management and provide instant global scalability. But once a SaaS platform scales to millions of active requests, the "Cloud Tax" (virtualization CPU scheduling penalties, steep inter-region data transfer fees, and marked-up SSD storage) can cripple operating margins. This is the technical story of our repatriation to bare-metal systems.</p>
          
          <h2>Performance Overheads of Virtualization</h2>
          <p>In virtualized hypervisor environments, a single CPU core is often oversubscribed among multiple tenants. This introduces subtle but destructive <strong>noisy-neighbor context switching latency</strong>. On bare-metal, database queries have direct, raw access to NVMe flash storage disks, slashing write times from 8ms on public cloud volumes to a spectacular 0.4ms on dedicated hardware.</p>

          <h2>The Core Bare-Metal Stack</h2>
          <p>Instead of managing raw servers individually, we built a private cloud orchestrator utilizing lightweight tools:</p>
          <ul>
            <li><strong>Proxmox VE</strong>: Open-source hypervisor platform to run isolated LXC containers at near-zero virtualization overhead.</li>
            <li><strong>Nginx & Keepalived</strong>: Setting up high-availability floating IP load balancers on raw hardware grids.</li>
            <li><strong>Ansible</strong>: Automatically deploying and provisioning configuration baselines across raw server racks.</li>
          </ul>

          <h2>The Bottom Line</h2>
          <p>By migrating our core web servers and database instances onto rented bare-metal servers in dedicated tier-3 datacenters, we <strong>slashed our monthly infrastructure bill by 68%</strong> while simultaneously observing a 42% decrease in p99 API response latencies. Monolithic cloud platforms are fantastic to start, but hardware repatriation remains a powerful weapon for scaling SaaS operations.</p>
        `
      },
      {
        title: "Writing Self-Documenting Code: Clean Code Practices in Modern Web Stacks",
        description: "How to leverage declarative API designs, type safety, and clean formatting principles to eliminate bloated comments and write highly maintainable React 19 apps.",
        category: "Software Engineering",
        image: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=1200&auto=format&fit=crop",
        createdby: defaultAuthor._id,
        content: `
          <h2>Comments are Often Code Smells</h2>
          <p>We've all encountered codebases where every single line is preceded by a bloated comment. While comments are well-intentioned, they often act as band-aids covering poorly structured code. Worse, as code evolves, comments quickly become stale, lying about what the code actually does. Modern engineering prioritizes writing self-documenting clean code.</p>
          
          <h2>Declarative Over Imperative</h2>
          <p>Declarative code describes <i>what</i> should happen rather than <i>how</i> to step-by-step calculate it. Compare these two React approaches for rendering categories:</p>

          <pre><code>// ❌ BAD: Imperative, bloated with explanations
// This loop filters articles, builds list, checks dates, and renders
const items = [];
for(let i=0; i<data.length; i++) {
  if (data[i].active === true && data[i].category === "AI") {
    items.push(&lt;Card key={data[i].id} title={data[i].title} /&gt;);
  }
}

//  GOOD: Declarative, self-explanatory clean code
const activeAICards = data
  .filter(isBlogActive)
  .filter(isAICategory)
  .map(renderBlogCard);</code></pre>

          <h2>Simple Rules for Self-Documenting Code</h2>
          <p>To eliminate 90% of your inline comments and create a spectacular codebase, adhere to these simple, disciplined clean-code rules:</p>
          
          <ul>
            <li><strong>Descriptive Naming</strong>: Avoid vague abbreviations. Prefer <code>fetchActiveSubscribers()</code> over <code>getUsers()</code> or <code>fetchSubs()</code>.</li>
            <li><strong>Single Responsibility (SRP)</strong>: A function should do exactly one thing. If you need a comment to explain "Part 2" of a function, extract Part 2 into its own descriptive function!</li>
            <li><strong>Utilize Guard Clauses</strong>: Return early from functions to eliminate deeply nested, confusing if-else code blocks.</li>
          </ul>
          
          <p>By enforcing clean, semantic naming conventions, your codebase becomes a readable book that any developer can immediately understand without reading outdated inline explanations.</p>
        `
      }
    ];

    await Blog.insertMany(mockBlogs);
    console.log("Database seeded successfully with 4 premium technology articles!");
  } catch (err) {
    console.error("Seeder failed:", err);
  }
}
