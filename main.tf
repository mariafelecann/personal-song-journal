provider "google" {
  project = "song-journal-back"
  region  = "us-central1"
}

resource "google_container_cluster" "song_journal_cluster" {
  name     = "song-journal-cluster"
  location = "us-central1"

  initial_node_count = 1

  node_config {
    machine_type = "e2-micro"
    disk_size_gb = 10
  }
}