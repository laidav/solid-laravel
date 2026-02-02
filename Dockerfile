FROM php:8.5-fpm
WORKDIR /workspace

# System deps
RUN apt-get update && apt-get install -y \
    curl \
    unzip \
    git \
    default-mysql-client \
    && rm -rf /var/lib/apt/lists/*

# PHP extensions for MariaDB / MySQL
RUN docker-php-ext-install pdo_mysql mysqli

# Install Composer
RUN curl -sS https://getcomposer.org/installer | php \
    -- --install-dir=/usr/local/bin --filename=composer

# ---- Node.js 24.13.0 (HARD PINNED) ----
RUN curl -fsSL https://deb.nodesource.com/setup_24.x | bash - \
    && apt-get install -y nodejs=24.13.0-1nodesource1 \
    && apt-mark hold nodejs
