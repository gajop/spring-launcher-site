export interface Game {
  name: string;
  title: string;
  full_name: string;
  builds: Build[];
  download_links: DownloadLink[];

  // processed
  game_title: string;
}

export interface DownloadLink {
  platform: string;
  link: string;
}

export interface Build {
  commit: Commit;
  build_info: BuildInfo;
  result_info: ResultInfo;
}

export interface Commit {
  message: string;
  hash: string;
  url: string;
  timestamp: Date;
  committer: Committer;
}

export interface Committer {
  name: string;
  email: string;
  username: string;
}

export interface BuildInfo {
  created_time: Date;
  started_time: Date;
  ended_time: Date;
  status: string;
  err_msg: string;
}

export interface ResultInfo {
  dl_windows_url: string;
  dl_linux_url: string;
  dl_build_log_url: string;
}

// title: string;
// image_url: string;
// github_url: string;
// site_url: string;
