import React, { useEffect, useState } from 'react';
import Pagination from '@material-ui/lab/Pagination';
import './drawer.styles.css';
import productData from '../../products';
import ProductListComponent from '../product-list/productList.component';
import { uniq } from 'lodash';
import { Grid } from '@material-ui/core';
import { sortArrayInDesc, filterArray } from '../../utils';

import DataContext from '../../context';
import FilterComponent from '../filter';

const defaultCount = 10;
const defaultPage = 1;

const Container = () => {
  const [productList, setProductList] = useState([]);
  const [page, setPage] = useState({
    page: defaultPage,
    count: productData.length / defaultCount,
  });

  const [romFilter, setRomFilter] = useState([]);
  const [osFilter, setOsFilter] = useState([]);
  const [ramFilter, setRamFilter] = useState([]);
  const [filteredData, setFilterData] = useState(productData);

  const setFilters = () => {
    const OS_TYPES = uniq(productData.map((product) => product.os)).sort();
    const RAM_TYPES = sortArrayInDesc(
      uniq(productData.map((product) => product.memory))
    );
    const MEMORY_TYPES = sortArrayInDesc(
      uniq(productData.map((product) => product.storage))
    );

    const osTemp = OS_TYPES.map((type) => ({
      checked: false,
      name: type,
    }));
    setOsFilter(osTemp);
    const ramTemp = RAM_TYPES.map((type) => ({
      checked: false,
      name: type,
    }));
    setRamFilter(ramTemp);
    const romTemp = MEMORY_TYPES.map((type) => ({
      checked: false,
      name: type,
    }));
    setRomFilter(romTemp);
  };

  useEffect(() => {
    setFilters();
    setProductList(productData.slice(defaultPage - 1, defaultCount));
  }, []);

  const handlePaginationChange = (event, value) => {
    const temp = filteredData.slice(
      (value - 1) * defaultCount,
      value * defaultCount
    );
    setProductList(temp);
    setPage((state) => ({ ...state, page: value }));
  };

  const handleFilterChange = (name, checked, type) => {
    switch (type) {
      case 'os':
        setOsFilter((state) => {
          const temp = state.findIndex((s) => s.name === name);
          state[temp].checked = checked;
          return [...state];
        });
        break;
      case 'ram':
        setRamFilter((state) => {
          const temp = state.findIndex((s) => s.name === name);
          state[temp].checked = checked;
          return [...state];
        });
        break;
      case 'rom':
        setRomFilter((state) => {
          const temp = state.findIndex((s) => s.name === name);
          state[temp].checked = checked;
          return [...state];
        });
        break;
      default:
        break;
    }
  };

  const filterItems = () => {
    if (romFilter.length && osFilter.length && ramFilter.length) {
      // console.log({ romFilter, osFilter, ramFilter });
      const romSelected = romFilter.filter((type) => type.checked);
      const ramSelected = ramFilter.filter((type) => type.checked);
      const osSelected = osFilter.filter((type) => type.checked);
      if (romSelected.length || ramSelected.length || osSelected.length) {
        const filters = {};
        if (romSelected.length)
          filters.storage = (storage) =>
            romSelected.map((type) => type.name).includes(storage);

        if (ramSelected.length)
          filters.memory = (memory) =>
            ramSelected.map((type) => type.name).includes(memory);
        if (osSelected.length)
          filters.os = (os) => osSelected.map((type) => type.name).includes(os);

        const result = filterArray(productData, filters);
        setFilterData(result);
        setPage({ count: Math.round(result.length / defaultCount), page: 1 });
        if (result.length) {
          setProductList(result.slice(0, defaultCount));
        } else {
          setProductList([]);
        }
        // console.log(result);
        // console.log({ romSelected, ramSelected, osSelected });
      } else {
        setProductList(productData.slice(defaultPage - 1, defaultCount));
        setFilterData(productData);
      }
    }
  };

  useEffect(() => {
    filterItems();
  }, [romFilter, osFilter, ramFilter]);

  return (
    <DataContext.Provider
      value={{
        productList,
        allData: filteredData,
      }}
    >
      <Grid container={true}>
        <Grid item xs={2}>
          <Grid container style={{ marginTop: '100px' }}>
            <Grid item xs={12}>
              <FilterComponent
                title="RAM"
                types={ramFilter}
                handleChange={({ target: { name } }, checked) =>
                  handleFilterChange(name, checked, 'ram')
                }
              />
            </Grid>
            <Grid item xs={12}>
              <FilterComponent
                title="OS"
                types={osFilter}
                handleChange={({ target: { name } }, checked) =>
                  handleFilterChange(name, checked, 'os')
                }
              />
            </Grid>
            <Grid item xs={12}>
              <FilterComponent
                title="ROM"
                types={romFilter}
                handleChange={({ target: { name } }, checked) =>
                  handleFilterChange(name, checked, 'rom')
                }
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={10} container>
          <Grid item xs={12}>
            {productList.length ? (
              <ProductListComponent />
            ) : (
              <p style={{ marginTop: '14rem' }}>No Products Available</p>
            )}
          </Grid>
          <Grid item xs={12} className="paginationCotainer">
            <Pagination
              count={page.count}
              page={page.page}
              color="primary"
              onChange={handlePaginationChange}
            />
          </Grid>
        </Grid>
      </Grid>
    </DataContext.Provider>
  );
};

export default Container;
