import { formatDuration, intervalToDuration } from "date-fns";
import { computed, ref } from "vue";

export const endIn = (endDate: Date) => {
    const remainingTime = ref('');
  
    const updateRemainingTime = () => {
      const now = new Date();
      const duration = intervalToDuration({
        start: now,
        end: endDate,
      });
      remainingTime.value = formatDuration(duration);
    };
  
    // Initial call to update the time
    updateRemainingTime();
  
    // Set up an interval to update the remaining time every second
    setInterval(updateRemainingTime, 1000);
  
    return computed(() => remainingTime.value);
  };