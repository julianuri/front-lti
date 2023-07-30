import BOARDS from '../../../../../types/enums/BoardsEnum';

type CarouselItem = {
  selected: {
    id: number;
    image: string;
  };
  handleClick: (id: number) => void;
};

const Carousel = function (props: CarouselItem) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <img
        key={props.selected.id}
        src={props.selected.image}
        style={{ height: '18rem' }}
      />
      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
        {BOARDS.map((board) => {
          return (
            <img
              key={board.id}
              src={board.image}
              style={{ width: '5rem' }}
              onClick={() => props.handleClick(board.id)}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Carousel;
