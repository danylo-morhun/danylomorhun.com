import { ref, computed } from 'vue';

export function useImageCarousel(images: string[]) {
  const isModalOpen = ref(false);
  const currentImageIndex = ref(0);

  const hasMultipleImages = computed(() => images.length > 1);

  const openModal = (index: number = 0) => {
    if (images.length > 0) {
      currentImageIndex.value = index;
      isModalOpen.value = true;
      document.body.style.overflow = 'hidden';
    }
  };

  const closeModal = () => {
    isModalOpen.value = false;
    document.body.style.overflow = '';
  };

  const handleBackdropClick = (e: MouseEvent) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  const goToNext = () => {
    if (hasMultipleImages.value) {
      currentImageIndex.value = (currentImageIndex.value + 1) % images.length;
    }
  };

  const goToPrevious = () => {
    if (hasMultipleImages.value) {
      currentImageIndex.value = (currentImageIndex.value - 1 + images.length) % images.length;
    }
  };

  const goToImage = (index: number) => {
    currentImageIndex.value = index;
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (!isModalOpen.value) return;
    
    if (e.key === 'Escape') {
      closeModal();
    } else if (e.key === 'ArrowLeft') {
      goToPrevious();
    } else if (e.key === 'ArrowRight') {
      goToNext();
    }
  };

  const currentImage = computed(() => images[currentImageIndex.value] || '');

  return {
    isModalOpen,
    currentImageIndex,
    hasMultipleImages,
    currentImage,
    openModal,
    closeModal,
    handleBackdropClick,
    goToNext,
    goToPrevious,
    goToImage,
    handleKeyDown,
  };
}

