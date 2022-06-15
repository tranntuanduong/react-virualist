import { Skeleton } from "antd";
import { scrollbarSize } from "dom-helpers";
import useOnClickOutside from "hooks/useOnClickOutside";
import React, { MouseEvent, useEffect, useRef, useState } from "react";
import {
  AutoSizer,
  Grid,
  GridCellProps,
  List,
  ListRowProps,
  ScrollParams,
  ScrollSync,
} from "react-virtualized";
import { start } from "repl";
import styled from "styled-components";
import "./App.css";
import { getDataSource } from "./service";

enum ScrollDirection {
  TOP,
  BOTTOM,
}

function App() {
  const [data, setData] = useState<any[]>([]);
  const [total, setTotal] = useState<number>(10);
  const columns = [
    "id",
    "customer",
    "owner",
    "revenue",
    "involed",
    "costs",
    "spent",
    "status",
    "date",
  ];

  const [filters, setFilters] = useState({
    pageSize: 6,
    pageIndex: 1,
  });
  const [itemIndex, setItemIndex] = useState<number>(0);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [startIndex, setStartIndex] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const debounceRef = useRef<any>(null);
  const [scrollDirection, setScrollDirection] = useState<ScrollDirection>(
    ScrollDirection.BOTTOM
  );
  const [selectIds, setSelectIds] = useState<string[]>([]);
  const tableRef = useRef<HTMLDivElement | null>(null);
  const [shiftSelectAnchor, setShifSelectAnchor] = useState<number | null>(
    null
  );

  useEffect(() => {
    (async () => {
      try {
        console.log("scrollDirection", scrollDirection);

        if (
          !Boolean(data[currentIndex - startIndex]) ||
          !Boolean(data[currentIndex - startIndex + 10])
        ) {
          const res = await getDataSource("/deals1", {
            itemIndex: itemIndex,
            scrollDirection: scrollDirection,
          });
          setStartIndex(itemIndex);
          setTotal(res.total);
          setData(res.data);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    })();
  }, [itemIndex]);

  const clickHandler = (id: string, rowIndex: number) => (e: MouseEvent) => {
    e.stopPropagation();

    if (e.ctrlKey || e.metaKey) {
      console.log("clr click", id);
      if (selectIds.includes(id)) {
        const newArray = selectIds.filter((item) => item !== id);
        setSelectIds(newArray ?? []);
      } else {
        setSelectIds([...selectIds, id]);
      }

      if (shiftSelectAnchor === null) {
        setShifSelectAnchor(rowIndex);
      }
    } else if (e.shiftKey) {
      console.log("shiftKey", rowIndex);
      if (shiftSelectAnchor === null) {
        setShifSelectAnchor(rowIndex);
        setSelectIds([data[rowIndex].id]);
      } else {
        const [index1, index2] =
          rowIndex > shiftSelectAnchor
            ? [shiftSelectAnchor, rowIndex]
            : [rowIndex, shiftSelectAnchor];

        const selectIds = data
          .slice(index1 - startIndex, index2 - startIndex + 1)
          .map((item) => item.id);
        setSelectIds(selectIds);
      }
    } else {
      console.log("single click row", id);
    }
  };

  const cellRenderer = ({
    columnIndex,
    key,
    rowIndex,
    style,
  }: GridCellProps) => {
    if (!data[rowIndex - startIndex] || loading) {
      return (
        <StyledCellLoading key={key} style={style}>
          <StyledSekeleton
            style={{ width: "70%" }}
            active={true}
            size="default"
          />
        </StyledCellLoading>
      );
    } else if (data[rowIndex - startIndex]) {
      const selectStyle = selectIds.includes(data[rowIndex - startIndex].id)
        ? {
            backgroundColor: "#eaeaea",
            border: "0.5px solid #ccc",
          }
        : {
            border: "0.5px solid #ebebeb",
          };

      return (
        <div
          key={key}
          style={{
            ...style,
            // border: "0.5px solid #ebebeb",
            userSelect: "none",
            padding: "8px",
            display: "flex",
            alignItems: "center",
            ...selectStyle,
          }}
          onClick={clickHandler(data[rowIndex - startIndex].id, rowIndex)}
        >
          {data[rowIndex - startIndex][columns[columnIndex]]}
        </div>
      );
    }
  };

  const headerRenderer = ({
    columnIndex,
    key,
    rowIndex,
    style,
  }: GridCellProps) => {
    console.log("columns", columns);

    return (
      <div
        key={key}
        style={{
          ...style,
          border: "1px solid #ebebeb",
          userSelect: "none",
          backgroundColor: "#fafafa",
          display: "flex",
          alignItems: "center",
          padding: "8px",
          textTransform: "capitalize",
          fontSize: "16px",
        }}
      >
        {columns[columnIndex]}
      </div>
    );
  };

  const handleScroll = (onScroll: any) => (params: ScrollParams) => {
    const index = Math.ceil(params.scrollTop / 50);

    if (index - currentIndex >= 0) {
      setScrollDirection(ScrollDirection.BOTTOM);
    } else {
      setScrollDirection(ScrollDirection.TOP);
    }

    setCurrentIndex(index);
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      // if (scrollDirection === ScrollDirection.BOTTOM) {
      //   setItemIndex(index - 50 > 0 ? index - 50 : 0);
      // } else {
      //   setItemIndex(index - 150 > 0 ? index - 150 : 0);
      // }
      setItemIndex(index - 250 > 0 ? index - 250 : 0);

      if (data.length && !Boolean(data[currentIndex - startIndex])) {
        setLoading(true);
      }
    }, 300);

    //force scroll in List component
    onScroll({ ...params });
  };

  const rowRenderer = ({
    key, // Unique key within array of rows
    index, // Index of row within collection
    isScrolling, // The List is currently being scrolled
    isVisible, // This row is visible within the List (eg it is not an overscanned row)
    style, // Style object to be applied to row (to position it)
  }: ListRowProps) => {
    return (
      <div
        key={key}
        style={{
          ...style,
          backgroundColor: "#fafafa",
          border: "1px solid #ebebeb",
        }}
      >
        {index}
      </div>
    );
  };

  const handleSectionRendered = () => {
    console.log("onclick");
  };

  const handleClickOutside = () => {
    console.log("click out site");

    setSelectIds([]);
    setShifSelectAnchor(null);
  };

  useOnClickOutside(tableRef, handleClickOutside);

  return (
    <div style={{ margin: "50px", border: "1px solid #ebebeb" }} ref={tableRef}>
      {/*// @ts-ignore */}
      <ScrollSync>
        {({ onScroll, scrollTop, scrollLeft }) => (
          <div style={{ display: "flex" }}>
            <div className="LeftColumn">
              <StyledList
                scrollTop={scrollTop}
                width={50}
                height={500}
                rowCount={total}
                rowHeight={50}
                rowRenderer={rowRenderer}
              />
            </div>
            <div className="RightColumn" style={{ width: "100%" }}>
              {/*// @ts-ignore */}
              <AutoSizer disableHeight>
                {({ width }) => {
                  console.log("width", width);

                  return (
                    <div>
                      <StyledHeader
                        cellRenderer={headerRenderer}
                        columnCount={columns.length}
                        columnWidth={200}
                        height={50}
                        rowCount={1}
                        rowHeight={50}
                        width={width}
                        scrollLeft={scrollLeft}
                      />
                      <StyledGrid
                        cellRenderer={cellRenderer}
                        columnCount={columns.length}
                        columnWidth={200}
                        height={500}
                        rowCount={total}
                        rowHeight={50}
                        width={width}
                        onScroll={handleScroll(onScroll)}
                      />
                    </div>
                  );
                }}
              </AutoSizer>
            </div>
          </div>
        )}
      </ScrollSync>
    </div>
  );
}

//@ts-ignore */
const StyledList = styled(List)({
  marginTop: "50px",
  "&.ReactVirtualized__List": {
    overflow: "hidden !important",
    userSelect: "none",
  },
  "&:focus": {
    outline: "none",
  },
});

//@ts-ignore */
const StyledHeader = styled(Grid)({
  position: "relative",
  overflow: "hidden !important",
  paddingRight: "49px",
  "&:focus": {
    outline: "none",
  },
});

//@ts-ignore */
const StyledGrid = styled(Grid)({
  "&:focus": {
    outline: "none",
  },
});

const StyledSekeleton = styled(Skeleton.Input)({
  "&.ant-skeleton-element": {
    width: "auto",
  },
});

const StyledCellLoading = styled.div({
  border: "0.5px solid #ebebeb",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

export default App;
