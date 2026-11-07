-- Kept shared-data schema for the Webuzo VPS (MySQL 8 / MariaDB 10.6+).
-- Apply only during the approved deployment phase.

CREATE TABLE users (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(190) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  display_name VARCHAR(120) NOT NULL,
  role ENUM('traveller','organizer','admin') NOT NULL DEFAULT 'traveller',
  email_verified_at DATETIME NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE sessions (
  id CHAR(64) PRIMARY KEY,
  user_id BIGINT UNSIGNED NOT NULL,
  expires_at DATETIME NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT sessions_user_fk FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX sessions_user_expiry_idx (user_id, expires_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE organizers (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  owner_user_id BIGINT UNSIGNED NOT NULL,
  business_name VARCHAR(160) NOT NULL,
  business_email VARCHAR(190) NOT NULL,
  phone VARCHAR(32) NOT NULL,
  location VARCHAR(160) NOT NULL,
  channel_url VARCHAR(500) NULL,
  verification_status ENUM('pending','verified','rejected') NOT NULL DEFAULT 'pending',
  verified_at DATETIME NULL,
  verified_by BIGINT UNSIGNED NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT organizers_owner_fk FOREIGN KEY (owner_user_id) REFERENCES users(id),
  CONSTRAINT organizers_verifier_fk FOREIGN KEY (verified_by) REFERENCES users(id),
  UNIQUE KEY organizers_owner_unique (owner_user_id),
  INDEX organizers_status_idx (verification_status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE tours (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  slug VARCHAR(190) NOT NULL UNIQUE,
  organizer_id BIGINT UNSIGNED NOT NULL,
  destination_slug VARCHAR(190) NOT NULL,
  name VARCHAR(190) NOT NULL,
  summary TEXT NOT NULL,
  starts_at DATETIME NOT NULL,
  ends_at DATETIME NOT NULL,
  departure_city VARCHAR(120) NOT NULL,
  meeting_point VARCHAR(255) NOT NULL,
  capacity SMALLINT UNSIGNED NOT NULL,
  price_idr INT UNSIGNED NOT NULL,
  status ENUM('draft','published','in_progress','completed','cancelled') NOT NULL DEFAULT 'draft',
  cover_asset_key VARCHAR(255) NOT NULL,
  published_at DATETIME NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT tours_organizer_fk FOREIGN KEY (organizer_id) REFERENCES organizers(id),
  INDEX tours_destination_status_idx (destination_slug, status),
  INDEX tours_dates_idx (starts_at, ends_at),
  INDEX tours_organizer_status_idx (organizer_id, status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE promise_versions (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  tour_id BIGINT UNSIGNED NOT NULL,
  version_no SMALLINT UNSIGNED NOT NULL,
  status ENUM('draft','locked') NOT NULL DEFAULT 'draft',
  locked_at DATETIME NULL,
  locked_by BIGINT UNSIGNED NULL,
  content_hash CHAR(64) NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT promise_versions_tour_fk FOREIGN KEY (tour_id) REFERENCES tours(id) ON DELETE CASCADE,
  CONSTRAINT promise_versions_user_fk FOREIGN KEY (locked_by) REFERENCES users(id),
  UNIQUE KEY promise_versions_tour_version_unique (tour_id, version_no),
  INDEX promise_versions_tour_status_idx (tour_id, status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE promise_items (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  promise_version_id BIGINT UNSIGNED NOT NULL,
  item_key VARCHAR(80) NOT NULL,
  title VARCHAR(160) NOT NULL,
  promised_value TEXT NOT NULL,
  display_order SMALLINT UNSIGNED NOT NULL,
  CONSTRAINT promise_items_version_fk FOREIGN KEY (promise_version_id) REFERENCES promise_versions(id) ON DELETE CASCADE,
  UNIQUE KEY promise_items_version_key_unique (promise_version_id, item_key)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE change_logs (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  tour_id BIGINT UNSIGNED NOT NULL,
  promise_item_id BIGINT UNSIGNED NULL,
  title VARCHAR(190) NOT NULL,
  reason TEXT NOT NULL,
  replacement_value TEXT NOT NULL,
  participant_notified_at DATETIME NOT NULL,
  recorded_by BIGINT UNSIGNED NOT NULL,
  recorded_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT change_logs_tour_fk FOREIGN KEY (tour_id) REFERENCES tours(id) ON DELETE CASCADE,
  CONSTRAINT change_logs_promise_item_fk FOREIGN KEY (promise_item_id) REFERENCES promise_items(id),
  CONSTRAINT change_logs_user_fk FOREIGN KEY (recorded_by) REFERENCES users(id),
  INDEX change_logs_tour_recorded_idx (tour_id, recorded_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE evidence_assets (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  tour_id BIGINT UNSIGNED NOT NULL,
  change_log_id BIGINT UNSIGNED NULL,
  uploaded_by BIGINT UNSIGNED NOT NULL,
  storage_key VARCHAR(255) NOT NULL UNIQUE,
  original_name VARCHAR(255) NOT NULL,
  mime_type VARCHAR(120) NOT NULL,
  byte_size INT UNSIGNED NOT NULL,
  sha256 CHAR(64) NOT NULL,
  status ENUM('pending','approved','rejected') NOT NULL DEFAULT 'pending',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT evidence_tour_fk FOREIGN KEY (tour_id) REFERENCES tours(id) ON DELETE CASCADE,
  CONSTRAINT evidence_change_fk FOREIGN KEY (change_log_id) REFERENCES change_logs(id) ON DELETE SET NULL,
  CONSTRAINT evidence_user_fk FOREIGN KEY (uploaded_by) REFERENCES users(id),
  INDEX evidence_tour_status_idx (tour_id, status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE trip_passes (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  code_hash CHAR(64) NOT NULL UNIQUE,
  code_hint VARCHAR(12) NOT NULL,
  tour_id BIGINT UNSIGNED NOT NULL,
  participant_user_id BIGINT UNSIGNED NULL,
  participant_email VARCHAR(190) NOT NULL,
  status ENUM('issued','claimed','revoked') NOT NULL DEFAULT 'issued',
  claimed_at DATETIME NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT trip_passes_tour_fk FOREIGN KEY (tour_id) REFERENCES tours(id) ON DELETE CASCADE,
  CONSTRAINT trip_passes_user_fk FOREIGN KEY (participant_user_id) REFERENCES users(id),
  INDEX trip_passes_tour_status_idx (tour_id, status),
  INDEX trip_passes_email_idx (participant_email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE reality_checks (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  tour_id BIGINT UNSIGNED NOT NULL,
  trip_pass_id BIGINT UNSIGNED NOT NULL,
  submitted_by BIGINT UNSIGNED NOT NULL,
  note TEXT NULL,
  status ENUM('submitted','flagged','accepted','rejected') NOT NULL DEFAULT 'submitted',
  submitted_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  moderated_at DATETIME NULL,
  CONSTRAINT reality_checks_tour_fk FOREIGN KEY (tour_id) REFERENCES tours(id) ON DELETE CASCADE,
  CONSTRAINT reality_checks_pass_fk FOREIGN KEY (trip_pass_id) REFERENCES trip_passes(id),
  CONSTRAINT reality_checks_user_fk FOREIGN KEY (submitted_by) REFERENCES users(id),
  UNIQUE KEY reality_checks_pass_unique (trip_pass_id),
  INDEX reality_checks_tour_status_idx (tour_id, status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE reality_check_items (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  reality_check_id BIGINT UNSIGNED NOT NULL,
  promise_item_id BIGINT UNSIGNED NOT NULL,
  result ENUM('kept','changed','missed','unknown') NOT NULL,
  note VARCHAR(500) NULL,
  CONSTRAINT reality_items_check_fk FOREIGN KEY (reality_check_id) REFERENCES reality_checks(id) ON DELETE CASCADE,
  CONSTRAINT reality_items_promise_fk FOREIGN KEY (promise_item_id) REFERENCES promise_items(id),
  UNIQUE KEY reality_items_check_promise_unique (reality_check_id, promise_item_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE saved_tours (
  user_id BIGINT UNSIGNED NOT NULL,
  tour_id BIGINT UNSIGNED NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, tour_id),
  CONSTRAINT saved_tours_user_fk FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT saved_tours_tour_fk FOREIGN KEY (tour_id) REFERENCES tours(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE audit_events (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  actor_user_id BIGINT UNSIGNED NULL,
  entity_type VARCHAR(80) NOT NULL,
  entity_id BIGINT UNSIGNED NOT NULL,
  action VARCHAR(80) NOT NULL,
  payload_json JSON NULL,
  ip_hash CHAR(64) NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT audit_events_user_fk FOREIGN KEY (actor_user_id) REFERENCES users(id),
  INDEX audit_events_entity_idx (entity_type, entity_id, created_at),
  INDEX audit_events_actor_idx (actor_user_id, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
