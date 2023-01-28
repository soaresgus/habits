import { useTransition, animated } from '@react-spring/web';
import { PossibleOperators } from '../../../context/SearchContext/types';

interface ISearchBarFiltersMethodsPopoverProps {
  active?: boolean;
  onClickInMethod(operator: PossibleOperators): void;
}

type FilterMethod = {
  title: string;
  operator: PossibleOperators;
  example: string;
};

const filterMethods: FilterMethod[] = [
  {
    title: 'nome do hábito',
    operator: 'name',
    example: 'name beber 2L de água',
  },
  { title: 'data', operator: 'date', example: 'date 20/01' },
  { title: 'progresso', operator: 'progress', example: 'progress > 50' },
  { title: 'dias incompletos', operator: 'incomplete', example: 'incomplete' },
  { title: 'dias completos', operator: 'complete', example: 'complete' },
];

export function SearchBarFiltersMethodsPopover({
  active,
  onClickInMethod,
}: ISearchBarFiltersMethodsPopoverProps) {
  const filterMethodsPopoverTransition = useTransition(active, {
    from: { y: 4, opacity: 0 },
    enter: { y: 0, opacity: 1 },
    leave: { y: 4, opacity: 0 },
    config: { duration: 150 },
  });

  return filterMethodsPopoverTransition(
    (style, visible) =>
      visible && (
        <animated.div
          className="flex flex-col items-center bg-zinc-800 p-2 w-screen min-w-[300px] max-w-[340px] mt-3 rounded-lg z-50 absolute"
          style={style}
        >
          <span className="text-zinc-400 text-base">Formas de filtrar</span>
          <div className="flex flex-col gap-2 w-full text-sm">
            {filterMethods.map((method) => (
              <div
                key={method.title}
                className="flex justify-between bg-zinc-900 p-2 w-full rounded-lg transition-colors cursor-pointer hover:bg-background"
                onClick={() => onClickInMethod(method.operator)}
              >
                <span className="first-letter:capitalize ">{method.title}</span>
                <span className="text-zinc-400">Ex.: {method.example}</span>
              </div>
            ))}
            <span className="text-zinc-400 text-xs text-center">
              <span className="bg-zinc-900 p-1 rounded-sm">Dica</span>: Faça
              pesquisas múltiplas usando ponto e vírgula (
              <span className="bg-zinc-900 p-1 rounded-sm">;</span>)
            </span>
          </div>
        </animated.div>
      )
  );
}
