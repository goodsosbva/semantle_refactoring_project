<template>
  <div class="dialog-underlay" id="settings-underlay">
    <div
      class="dialog"
      id="settings"
      aria-labelledby="settings-heading"
      aria-modal="true"
      role="dialog"
    >
      <button class="dialog-close" id="settings-close" aria-label="Schließen">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          stroke-width="2"
          stroke="currentColor"
          fill="none"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
      <div class="dialog-content" id="settings-content">
        <h3 id="settings-heading">설정</h3>
        <div>
          <input
            type="checkbox"
            name="dark-mode"
            value="dark-mode"
            id="dark-mode"
          />
          <label for="dark-mode">다크 모드</label>
        </div>
        <div>
          <input
            type="checkbox"
            name="share-guesses"
            value="share-guesses"
            id="share-guesses"
          />
          <label for="share-guesses"
            >결과 공유 텍스트에 추측 횟수 표시하기</label
          >
        </div>
        <div>
          <input
            type="checkbox"
            name="share-time"
            value="share-time"
            id="share-time"
          />
          <label for="share-time">결과 공유 텍스트에 걸린 시간 표시하기</label>
        </div>
        <div>
          <input
            type="checkbox"
            name="share-top-guess"
            value="share-top-guess"
            id="share-top-guess"
          />
          <label for="share-top-guess"
            >결과 공유 텍스트에 최대 유사도 표시하기</label
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts"></script>
