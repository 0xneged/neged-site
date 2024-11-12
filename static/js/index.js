(() => {

  const dataList = {};
  let dataSearch = {};
  const countInOnePage = 10;
  let currentPage = 1;
  let totalCountPage = 1;
  let activeIndex = '0';

  const fetchData = async (selectedIndex) => {
    const urls = {
      "1": 'https://neged.site/api/allowances',
      "2": 'https://neged.site/api/tips'
    };

    if(dataList[selectedIndex]) {
      return dataList[selectedIndex];
    }

    try {
      const response = await fetch(urls[selectedIndex], {
        mode: 'cors',
        headers: {
          'Access-Control-Allow-Origin':'*'
        }
      });
      const data = await response.json();
  
      dataList[selectedIndex] = data;
  
      return data;
    } catch (err) {
      dataList[selectedIndex] = {};
      return [];
    }    
  }

  document.addEventListener('DOMContentLoaded', () => {
    const blockTab = document.querySelector('.block-allowances');
    const blockTabHeader = blockTab.querySelector('.tabs-header');
    const blockTabItems = blockTab.querySelector('.tabs-list');
    const blockSearch = blockTab.querySelector('.search-allowances');
    
    const blockPagination = blockTab.querySelector('.pagination');
    const paginationPrev = blockPagination.querySelector('.pagination-prev');
    const paginationNext = blockPagination.querySelector('.pagination-next');
    
    const setActiveToHeader = (selectedIndex) => {
      blockTabHeader.querySelectorAll('[data-item]').forEach((item) => {
        if (item.dataset.item === selectedIndex) {
          item.classList.add('active');
        } else {
          item.classList.remove('active');
        }
      })
    }

    const setActiveToTabItem = (selectedIndex) => {
      blockTabItems.querySelectorAll('[data-item]').forEach((item) => {
        if (item.dataset.item === selectedIndex) {
          item.classList.add('active');
        } else {
          item.classList.remove('active');
        }
      })
    }

    const getChunkData = (createdData, selectedPage) => {
      const startIndex = (selectedPage - 1) * countInOnePage;
      const endIndex = selectedPage * countInOnePage;
      const totalCount = Object.keys(createdData).length;
      totalCountPage = Math.ceil(totalCount / countInOnePage);
      
      return Object.entries(createdData).slice(startIndex, endIndex);
    }

    const createListItem = ({title, value}) => {
      return `<li>
        <span class="name">${title}</span>
        <span class="value">${value}</span>
      </li>`
    };

    const createList = (data, page = 1) => {

      const dataToList = getChunkData(data, page);

      return `<ul>
        ${dataToList.map(([key, value]) => createListItem({
          title: key,
          value: value
        })).join('')}
      </ul>`;
    };

    const setDataToTabItem = (selectedIndex, htmlList) => {
      const selectedTab = blockTabItems.querySelector(`[data-item="${selectedIndex}"]`);

      selectedTab.innerHTML = htmlList;
    }

    const changeDataPagination = (pageNum) => {
      const cSource = Object.keys(dataSearch).length > 0 ? dataSearch : dataList[activeIndex];
      const cData = createList(cSource, pageNum);

      setDataToTabItem(activeIndex, cData);
      createPaginationNumbers();
    }

    blockTabHeader.querySelectorAll('[data-item]').forEach((item) => {
      item.addEventListener('click', async () => {
        const clickIndex = item.dataset.item;

        if(clickIndex !== activeIndex) {
          activeIndex = clickIndex;
          setActiveToHeader(activeIndex);
          setActiveToTabItem(activeIndex);
          currentPage = 1;

          if (!dataList[clickIndex]) {
            await fetchData(clickIndex);

            changeDataPagination(1);
          } else {
            const totalCount = Object.keys(dataList[activeIndex]).length;
            totalCountPage = Math.ceil(totalCount / countInOnePage);
            createPaginationNumbers();
          }
        }
      })
    })

    // pagination

    const pagesList = (pages, delimeter) => {
     return pages.map((num) => {
        return `<li class="${num === currentPage ? 'active' : num === delimeter ? 'item-disabled' : 'item-pagination'}" data-page="${num}"><span>${num}</span></li>`
      }).join('');
    }

    const createPaginationNumbers = () => {
      let pages = Array.from(Array(totalCountPage).keys()).map((n) => n + 1);
      let items = [];
      const delimeter = '...';

      if(totalCountPage > 9) {
        const firstPage = pages[0];
        const lastPage = pages[pages.length - 1];

        pages = pages.slice(1, pages.length - 1);

        const intervalWithCurrentPage = () => {
          if (currentPage > 0 && currentPage < 6) {
            return [...pages.slice(0, 4), delimeter];
          }

          if(currentPage > lastPage - 4 && currentPage <= lastPage) {
            return [delimeter, ...pages.slice(-4)];
          }

          return [delimeter, currentPage - 1, currentPage, currentPage + 1, delimeter];
        }

        const reformatPages = intervalWithCurrentPage();
        reformatPages.splice(0, 0, firstPage);
        reformatPages.splice(reformatPages.length, 0, lastPage);

        
        items = pagesList(reformatPages, delimeter);
      } else {
        items = pagesList(pages, delimeter);
      }

      blockPagination.querySelector('.pagination-list').innerHTML = items;
    }

    paginationPrev.addEventListener('click', () => {
      if(currentPage <= 1) {
        return;
      }
      currentPage -= 1;
      changeDataPagination(currentPage);
    });

    paginationNext.addEventListener('click', () => {
      if(currentPage >= totalCountPage) {
        return;
      }
      currentPage += 1;
      changeDataPagination(currentPage);
    });

    document.addEventListener('click', (e) => {
      if(e.target.closest('.block-allowances .item-pagination')) {
        const pageNum = e.target.closest('.block-allowances .item-pagination').dataset.page;
        currentPage = Number(pageNum);
        changeDataPagination(currentPage);
      }
    })
    // /pagination

    // search
    const inputSearch = blockSearch.querySelector('input');
    const buttonSearch = blockSearch.querySelector('button');

    const startSearchAction = (sValue) => {
      const searchData = dataList[activeIndex];
      
      dataSearch = {};

      if(sValue.length > 0) {
        for(const [key, value] of Object.entries(searchData)) {
          if(key.toLowerCase().includes(sValue.toLowerCase())){
            dataSearch[key] = value;
          }
        };
      } 

      currentPage = 1;

      changeDataPagination(currentPage);
    }

    inputSearch.addEventListener('change', (e) => {
      const searchValue = e.target.value;
      
      startSearchAction(searchValue);
    })

    buttonSearch.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();

      const searchValue = inputSearch.value;

      startSearchAction(searchValue);
    })
    // /search
    
    // first init
    const firstClick = () => {
      blockTabHeader.querySelector('[data-item="1"]')?.click();
    };

    firstClick();
    // /first init

  })

})();
