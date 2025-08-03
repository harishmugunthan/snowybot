/**
 * Discord Bot Website By Anomus.LY
 * Repo URL: https://github.com/AnomusLY/CandyWeb
 * © 2025 Anomus.LY
 */

document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('.header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
  const navContainer = document.querySelector('.nav-container');
  const navLinks = document.querySelectorAll('.nav-link');

  mobileMenuToggle.addEventListener('click', () => {
    navContainer.classList.toggle('active');
    document.body.classList.toggle('menu-open');

    const icon = mobileMenuToggle.querySelector('i');
    if (navContainer.classList.contains('active')) {
      icon.className = 'fas fa-times';
    } else {
      icon.className = 'fas fa-bars';
    }
  });

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (navContainer.classList.contains('active')) {
        navContainer.classList.remove('active');
        document.body.classList.remove('menu-open');
        mobileMenuToggle.querySelector('i').className = 'fas fa-bars';
      }
    });
  });

  document.addEventListener('click', (e) => {
    if (
      navContainer.classList.contains('active') &&
      !navContainer.contains(e.target) &&
      !mobileMenuToggle.contains(e.target)
    ) {
      navContainer.classList.remove('active');
      document.body.classList.remove('menu-open');
      mobileMenuToggle.querySelector('i').className = 'fas fa-bars';
    }
  });

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        window.scrollTo({
          top: target.offsetTop - 80,
          behavior: 'smooth'
        });
      }
    });
  });

  const categories = document.querySelectorAll('.category');
  let autoSwitchInterval;
  let userInteracted = false;
  let currentCategoryIndex = 0;

  function switchToCategory(categoryIndex) {
    const category = categories[categoryIndex];

    if (category.classList.contains('active')) {
      return;
    }

    categories.forEach(c => c.classList.remove('active'));
    category.classList.add('active');

    const activeGroup = document.querySelector('.command-group.active');
    const groupToShow = document.querySelector(`[data-group="${category.dataset.category}"]`);

    if (activeGroup) {
      const items = activeGroup.querySelectorAll('.command-item');
      items.forEach((item, index) => {
        setTimeout(() => {
          item.style.opacity = '0';
          item.style.transform = 'translateY(-20px)';
        }, 30 * index);
      });

      setTimeout(() => {
        document.querySelectorAll('.command-group').forEach(g => {
          g.classList.remove('active');
        });

        if (groupToShow) {
          groupToShow.classList.add('active');

          const commandItems = groupToShow.querySelectorAll('.command-item');
          commandItems.forEach((item, index) => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(20px)';

            setTimeout(() => {
              item.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
              item.style.opacity = '1';
              item.style.transform = 'translateY(0)';
            }, 50 * index); 
          });
        }
      }, 300);
    } else {
      document.querySelectorAll('.command-group').forEach(g => {
        g.classList.remove('active');
      });

      if (groupToShow) {
        groupToShow.classList.add('active');

        const commandItems = groupToShow.querySelectorAll('.command-item');
        commandItems.forEach((item, index) => {
          item.style.opacity = '0';
          item.style.transform = 'translateY(20px)';

          setTimeout(() => {
            item.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
          }, 50 * index); 
        });
      }
    }
  }

  const progressBar = document.querySelector('.category-progress');
  const switchInterval = 5000;
  let startTime;

  function animateProgress(timestamp) {
    if (!startTime) startTime = timestamp;
    const elapsed = timestamp - startTime;
    const progress = Math.min(elapsed / switchInterval * 100, 100);

    progressBar.style.width = `${progress}%`;

    if (progress < 100 && !userInteracted) {
      requestAnimationFrame(animateProgress);
    } else if (progress >= 100 && !userInteracted) {
      startTime = null;
      progressBar.style.width = '0%';

      currentCategoryIndex = (currentCategoryIndex + 1) % categories.length;
      switchToCategory(currentCategoryIndex);

      requestAnimationFrame(animateProgress);
    } else if (userInteracted) {
      progressBar.style.width = '0%';
    }
  }

  function startAutoSwitch() {
    if (autoSwitchInterval) {
      clearInterval(autoSwitchInterval);
    }

    startTime = null;
    requestAnimationFrame(animateProgress);

    autoSwitchInterval = setInterval(() => {
      if (!userInteracted) {
        currentCategoryIndex = (currentCategoryIndex + 1) % categories.length;
        switchToCategory(currentCategoryIndex);

        progressBar.style.width = '0%';
        startTime = null;
      }
    }, switchInterval);
  }

  categories.forEach((category, index) => {
    category.addEventListener('click', () => {
      userInteracted = true;
      currentCategoryIndex = index;

      progressBar.style.width = '0%';

      switchToCategory(index);

      setTimeout(() => {
        userInteracted = false;
        requestAnimationFrame(function(timestamp) {
          startTime = timestamp;
          animateProgress(timestamp);
        });
      }, 10000);
    });
  });

  const commandsSection = document.querySelector('.commands');
  commandsSection.addEventListener('mousemove', () => {
    userInteracted = true;

    progressBar.style.width = '0%';

    clearTimeout(commandsSection.mouseMoveTimeout);
    commandsSection.mouseMoveTimeout = setTimeout(() => {
      userInteracted = false;
      requestAnimationFrame(function(timestamp) {
        startTime = timestamp;
        animateProgress(timestamp);
      });
    }, 10000);
  });

  generateCommandGroups();

  generateIconGrid();

  initAnimations();

  setTimeout(() => {
    const activeGroup = document.querySelector('.command-group.active');
    if (activeGroup) {
      const commandItems = activeGroup.querySelectorAll('.command-item');
      commandItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';

        setTimeout(() => {
          item.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
          item.style.opacity = '1';
          item.style.transform = 'translateY(0)';
        }, 50 * index);
      });
    }

    startAutoSwitch();
  }, 500);
});

function generateCommandGroups() {
  const commandList = document.querySelector('.command-list');

  const musicCommands = `
    <div class="command-group active" data-group="music">
      <h3 class="command-category-title"><i class="fa-solid fa-door-open"></i> Greeting Commands</h3>
      <div class="command-category-list">
        <div class="command-item">
          <div class="command-name"> /setwelcome</div>
          <div class="command-description">Setup welcome embed, channel and more.</div>
        </div>
        <div class="command-item">
          <div class="command-name"> /disablewelcome</div>
          <div class="command-description">Disable the welcome system</div>
        </div>
        <div class="command-item">
          <div class="command-name"> /previewwelcome</div>
          <div class="command-description">Preview the current welcome setup</div>
        </div>
        <div class="command-item">
          <div class="command-name"> /setboost</div>
          <div class="command-description">Setup boost greeting embed, channel and more.</div>
        </div>
        <div class="command-item">
          <div class="command-name"> /disableboost</div>
          <div class="command-description">Disable the boost greeting system</div>
        </div>
        <div class="command-item">
          <div class="command-name"> /previewboost</div>
          <div class="command-description">Preview the current boost greet system</div>
        </div>
        <div class="command-item">
          <div class="command-name"> /editwelcome</div>
          <div class="command-description">Edit the welcome setup</div>
        </div>
        <div class="command-item">
          <div class="command-name"> /editboost</div>
          <div class="command-description">Edit the boost greeting setup</div>
        </div>
        <div class="command-item">
          <div class="command-name"> /addwelcomerole</div>
          <div class="command-description">Add another welcome role</div>
        </div>
        <div class="command-item">
          <div class="command-name"> /addboostrole</div>
          <div class="command-description">Add another booster role</div>
        </div>
      </div>
    </div>
  `;

  const filterCommands = `
    <div class="command-group" data-group="filters">
      <h3 class="command-category-title"><i class="fa-solid fa-headphones"></i> Temp VC Commands</h3>
      <div class="command-category-list">
        <div class="command-item">
          <div class="command-name"> /interfacecreate</div>
          <div class="command-description">Create temp vc interface in your server</div>
        </div>
        <div class="command-item">
          <div class="command-name"> /interfacedelete</div>
          <div class="command-description">Delete temp vc interface in your server</div>
        </div>
        <div class="command-item">
          <div class="command-name"> /editinterface</div>
          <div class="command-description">Edit the temp vc interface in your server</div>
        </div>
        <div class="command-item">
          <div class="command-name"> /claimvc</div>
          <div class="command-description">Claim the temp vc channel</div>
        </div>
        <div class="command-item">
          <div class="command-name"> /lockvc</div>
          <div class="command-description">Lock your temp vc channel</div>
        </div>
        <div class="command-item">
          <div class="command-name"> /unlockvc</div>
          <div class="command-description">Unlock your temp vc channel</div>
        </div>
        <div class="command-item">
          <div class="command-name"> /hidevc</div>
          <div class="command-description">Hide your temp vc channel</div>
        </div>
        <div class="command-item">
          <div class="command-name"> /unhidevc</div>
          <div class="command-description">Unhide your temp vc channel</div>
        </div>
        <div class="command-item">
          <div class="command-name"> /increasevclimit</div>
          <div class="command-description">Increase the user limit in your temp vc</div>
        </div>
        <div class="command-item">
          <div class="command-name">/decreasevclimit</div>
          <div class="command-description">Decrease the user limit in your temp vc</div>
        </div>
      </div>
    </div>
  `;

  const playlistCommands = `
    <div class="command-group" data-group="playlist">
      <h3 class="command-category-title"><i class="fa-solid fa-gifts"></i> Giveaway Commands</h3>
      <div class="command-category-list">
        <div class="command-item">
          <div class="command-name"> /giveawaycreate</div>
          <div class="command-description">Create a new giveaway</div>
        </div>
        <div class="command-item">
          <div class="command-name"> /giveawayedit</div>
          <div class="command-description">Edit a giveaway</div>
        </div>
        <div class="command-item">
          <div class="command-name"> /giveawaydelete</div>
          <div class="command-description">Delete a giveaway</div>
        </div>
        <div class="command-item">
          <div class="command-name"> /giveawayend</div>
          <div class="command-description">End a running giveaway</div>
        </div>
        <div class="command-item">
          <div class="command-name"> /giveawaylist</div>
          <div class="command-description">View all your giveaways</div>
        </div>
        <div class="command-item">
          <div class="command-name"> /giveawayreroll</div>
          <div class="command-description">Reroll the giveaway for new winner</div>
        </div>
        <div class="command-item">
          <div class="command-name"> /addgiveawayentries</div>
          <div class="command-description">Add more entries for a user</div>
        </div>
        <div class="command-item">
          <div class="command-name"> /giveawayentryrole</div>
          <div class="command-description">Setup a role for more entries</div>
        </div>
        <div class="command-item">
          <div class="command-name"> /giveawaysendbutton</div>
          <div class="command-description">Send giveaway using button system</div>
        </div>
        <div class="command-item">
          <div class="command-name"> /giveawaysenddropdown</div>
          <div class="command-description">Send giveaway using dropdown</div>
        </div>
      </div>
    </div>
  `;

  const utilityCommands = `
    <div class="command-group" data-group="utility">
      <h3 class="command-category-title"><i class="fa-solid fa-chart-simple"></i> Leveling Commands</h3>
      <div class="command-category-list">
        <div class="command-item">
          <div class="command-name"> /level</div>
          <div class="command-description">Shows the user's current level</div>
        </div>
        <div class="command-item">
          <div class="command-name"> /leaderboard</div>
          <div class="command-description">Shows the server's leaderboard</div>
        </div>
        <div class="command-item">
          <div class="command-name"> /addxp</div>
          <div class="command-description">Add xp to a user</div>
        </div>
        <div class="command-item">
          <div class="command-name"> /editlevel</div>
          <div class="command-description">Edit user's levels</div>
        </div>
        <div class="command-item">
          <div class="command-name"> /setuplevelrewards</div>
          <div class="command-description">Setup custom level rewards</div>
        </div>
        <div class="command-item">
          <div class="command-name"> /editlevelrewards</div>
          <div class="command-description">Edit level rewards</div>
        </div>
        <div class="command-item">
          <div class="command-name"> /setuplevelling</div>
          <div class="command-description">Setup Levelling system in your server</div>
        </div>
        <div class="command-item">
          <div class="command-name"> /disablelevelling</div>
          <div class="command-description">Disable levelling system in your server</div>
        </div>
        <div class="command-item">
          <div class="command-name"> /editlevelling</div>
          <div class="command-description">Edit the levelling setup</div>
        </div>
        <div class="command-item">
          <div class="command-name"> /resetlevel</div>
          <div class="command-description">Reset level for a user</div>
        </div>
      </div>
    </div>
  `;

  commandList.innerHTML = musicCommands + filterCommands + playlistCommands + utilityCommands;
}

function generateIconGrid() {
  const iconsContainer = document.querySelector('.icons-container');

  /*const icons = [
    { name: 'play', icon: 'fas fa-play' },
    { name: 'pause', icon: 'fas fa-pause' },
    { name: 'skip', icon: 'fas fa-forward' },
    { name: 'previous', icon: 'fas fa-backward' },
    { name: 'stop', icon: 'fas fa-stop' },
    { name: 'loop', icon: 'fas fa-redo' },
    { name: 'shuffle', icon: 'fas fa-random' },
    { name: 'volume', icon: 'fas fa-volume-up' },
    { name: 'mute', icon: 'fas fa-volume-mute' },
    { name: 'playlist', icon: 'fas fa-list' },
    { name: 'lyrics', icon: 'fas fa-file-alt' },
    { name: 'filter', icon: 'fas fa-sliders-h' },
    { name: 'spotify', icon: 'fab fa-spotify' },
    { name: 'youtube', icon: 'fab fa-youtube' },
    { name: 'soundcloud', icon: 'fab fa-soundcloud' },
    { name: 'deezer', icon: 'fas fa-music' },
    { name: 'apple', icon: 'fab fa-apple' },
    { name: 'radio', icon: 'fas fa-broadcast-tower' },
    { name: '24/7', icon: 'fas fa-clock' },
    { name: 'queue', icon: 'fas fa-stream' },
    { name: 'search', icon: 'fas fa-search' },
    { name: 'grab', icon: 'fas fa-download' },
    { name: 'vote', icon: 'fas fa-vote-yea' },
    { name: 'premium', icon: 'fas fa-crown' },
    { name: 'support', icon: 'fas fa-headset' },
    { name: 'invite', icon: 'fas fa-user-plus' },
    { name: 'help', icon: 'fas fa-question-circle' },
    { name: 'settings', icon: 'fas fa-cog' },
    { name: 'bassboost', icon: 'fas fa-volume-down' },
    { name: 'nightcore', icon: 'fas fa-moon' },
    { name: 'karaoke', icon: 'fas fa-microphone' },
    { name: 'vaporwave', icon: 'fas fa-water' },
    { name: 'equalizer', icon: 'fas fa-sliders-h' },
    { name: 'volume_up', icon: 'fas fa-volume-up' },
    { name: 'volume_down', icon: 'fas fa-volume-down' },
    { name: 'discord', icon: 'fab fa-discord' },
    { name: 'heart', icon: 'fas fa-heart' },
    { name: 'star', icon: 'fas fa-star' },
    { name: 'fire', icon: 'fas fa-fire' },
    { name: 'bolt', icon: 'fas fa-bolt' },
  ];*/

  let iconsHTML = '';
  icons.forEach(icon => {
    iconsHTML += `
      <div class="icon-item" data-name="${icon.name}" title="${icon.name}">
        <span><i class="${icon.icon}"></i></span>
      </div>
    `;
  });

  iconsContainer.innerHTML = iconsHTML;

  const iconItems = document.querySelectorAll('.icon-item');
  iconItems.forEach(item => {
    const randomDelay = Math.random() * 2;
    item.style.animationDelay = `${randomDelay}s`;

    item.addEventListener('mouseenter', () => {
      const ripple = document.createElement('span');
      ripple.className = 'ripple';
      item.appendChild(ripple);

      item.classList.add('glow');

      setTimeout(() => {
        ripple.remove();
        item.classList.remove('glow');
      }, 1000);
    });
  });
}

function initAnimations() {
  const animateOnScroll = () => {
    const elements = document.querySelectorAll('.feature-card, .pricing-card, .support-card');

    elements.forEach(element => {
      const elementTop = element.getBoundingClientRect().top;
      const elementBottom = element.getBoundingClientRect().bottom;

      if (elementTop < window.innerHeight && elementBottom > 0) {
        element.classList.add('animate');
      }
    });
  };

  animateOnScroll();

  window.addEventListener('scroll', animateOnScroll);
}

function handleSpotifyAuth() {
  const callbackElement = document.getElementById('spotify-callback');

  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get('code');

  if (code) {
    callbackElement.innerHTML = `<p>Authentication successful You can close this window.</p>`;
    callbackElement.style.display = 'block';

    setTimeout(() => {
      callbackElement.style.display = 'none';
    }, 5000);
  }
}
