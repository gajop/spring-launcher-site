export interface Game {
  name: string;
  full_name: string;
  builds: Build[];

  // processed
  game_title: string;
}

interface Build {
  commit: Commit;
  build_info: BuildInfo;
  result_info: ResultInfo;
}

interface Commit {
  message: string;
  hash: string;
  url: string;
  timestamp: Date;
  committer: Committer;
}

interface Committer {
  name: string;
  email: string;
  username: string;
}

interface BuildInfo {
  created_time: Date;
  started_time: Date;
  ended_time: Date;
  status: string;
  err_msg: string;
}

interface ResultInfo {
  dl_windows_url: string;
  dl_linux_url: string;
  dl_build_log_url: string;
}

// title: string;
// image_url: string;
// github_url: string;
// site_url: string;
