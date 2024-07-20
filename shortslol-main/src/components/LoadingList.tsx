import {
  VIDEO_GENERATION_ORDER,
  VideoGenerationStages,
  VideoTable,
} from '@shortslol/common';

import { LoadingStates } from '@/constant/videos/loadingState';
import { VideoGenerationStepsService } from '@/domain/services/videoGenerationStepsService';

type LoaderListProps = {
  video: VideoTable;
};

export default function LoadingList({ video }: LoaderListProps) {
  const currentStep: VideoGenerationStages =
    VideoGenerationStepsService.getCurrentStep(video) ||
    VideoGenerationStages.PROMPT;

  const activeLoadingStepIndex =
    VideoGenerationStepsService.getStepIndex(currentStep) + 1;

  const stepsLength = VIDEO_GENERATION_ORDER.length;

  return (
    <nav
      className='flex flex-col-reverse items-center justify-center gap-y-4'
      aria-label='Progress'
    >
      <p className='text-sm font-medium text-gray-600'>
        Step {activeLoadingStepIndex} / {stepsLength} :{' '}
        {LoadingStates[currentStep].label}
      </p>
      <ol className='flex h-full items-center space-x-5 py-1.5'>
        {Array.from({ length: stepsLength }).map((_, index) => {
          const arrayStep = index + 1;

          return (
            <li key={arrayStep}>
              {arrayStep < activeLoadingStepIndex ? (
                // Completed step
                <div className='block h-2.5 w-2.5 rounded-full bg-indigo-600 hover:bg-indigo-900'></div>
              ) : arrayStep === activeLoadingStepIndex ? (
                // Current step
                <div
                  className='relative flex items-center justify-center'
                  aria-current='step'
                >
                  <span
                    className='absolute flex h-5 w-5 p-px'
                    aria-hidden='true'
                  >
                    <span className='h-full w-full rounded-full bg-indigo-200' />
                  </span>
                  <span
                    className='relative block h-2.5 w-2.5 rounded-full bg-indigo-600'
                    aria-hidden='true'
                  />
                </div>
              ) : (
                // Future step
                <div className='block h-2.5 w-2.5 rounded-full bg-gray-200 hover:bg-gray-400'></div>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
