import { LatestNews } from "./components/latest-news";
import { SidebarNews } from "./components/sidebar-news";
import { EntertainmentSection } from "./components/entertainment-section";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.container}>
      <div className={styles.mainContent}>
        <LatestNews />
        <EntertainmentSection />
      </div>
      <div className={styles.sidebar}>
        <SidebarNews />
      </div>
    </div>
  );
}
