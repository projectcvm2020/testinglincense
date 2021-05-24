import React, { useState, useEffect, useRef } from "react";
import { connect } from "react-redux";
import ButtonS from "react-bootstrap/Button";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import { postRequest, getRequest } from "../../utility/net/urls";
import MenuItem from "@material-ui/core/MenuItem";
import TextField from "@material-ui/core/TextField";
import IconButton from "@material-ui/core/IconButton";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import Table from "react-bootstrap/Table";
import Cancel from "@material-ui/icons/Cancel";
export const AutocompleteBody = ({ searchListVisible, render,hasItems }) => {
  return (
    <>
      {(searchListVisible&&hasItems) && (
        <div
          style={{
            position: "absolute",
            backgroundColor: "#fff",
            width: 200,
            zIndex: 2000,
            width: "52ch",
            marginTop: -5,
            marginLeft: 5,
          
          }}
        >
          <Table striped bordered hover>
            {render()}
          </Table>
        </div>
      )}
    </>
  );
};
function autocomplete({
  token,
  label,
  url,
  disabled,
  error,
  helperText,
  setSearchListVisible,
  entityList,
  setEntityList,
  itemFocused,
  setItemFocused,
  entityName,
  setEntityName,
  setSelectedData,
  selectedUpValue,
  selectedDownValue,
  setShowCreateItem
}) {
  const input1Ref = useRef(null);
  const [searchEntityValue, setSearchEntityValue] = useState(null);
  const findEntity = () => {
    getRequest(url + "?search=" + searchEntityValue + "&offSet=0", token).then(
      (res) => {
        console.log(res);
        if (res.data.length > 0) {
          setSearchListVisible(true);

          setEntityList(res.data);
          setItemFocused(-1);
        } else setEntityList([]);
      }
    );
  };
  useEffect(() => {
    if (searchEntityValue) {
      // setIsFetching(true);
      const timeout = setTimeout(() => {
        findEntity();
      }, 300);
      return () => clearTimeout(timeout);
    } else setEntityList([]);
  }, [searchEntityValue]);
  return (
    <>
      <div>
        <ClickAwayListener
          onClickAway={() => {
            setSearchListVisible(false);
          }}
        >
          <TextField
            id="tx"
            label={label}
            ref={input1Ref}
            disabled={disabled}
            error={error}
            helperText={helperText}
            //value={entityName}
            autoComplete='off'
            required
            style={{ width: "45ch" }}
            onChange={(t) => {
              //setEntityName(t.target.value);
            }}
            onKeyPress={(t) => {
              if (t.key != "Enter") setSearchEntityValue(t.target.value);
            }}
            onClick={() => setSearchListVisible(true)}
            onKeyDown={(event) => {
              if (
                event.key == "ArrowDown" &&
                itemFocused < entityList.length - 1
              ) {
                try {
                  setEntityName(selectedDownValue());

                  setSelectedData(entityList[itemFocused + 1]);

                  document.getElementById("tx").value = selectedDownValue();
                } catch {}
                setItemFocused(itemFocused + 1);
              }
              if (event.key == "ArrowUp" && itemFocused > -1) {
                try {
                  setEntityName(selectedUpValue());

                  setSelectedData(entityList[itemFocused - 1]);
                  document.getElementById("tx").value = selectedUpValue();
                } catch {}
                setItemFocused(itemFocused - 1);
              }
              if (event.key == "Enter") {
                setSearchListVisible(false);
                setEntityList([]);
              }
            }}
          />
        </ClickAwayListener>

        {entityName && (
          <IconButton
            style={{
              position: "absolute",
              marginLeft: -40,
              marginTop: 15,
            }}
            onClick={() => {
              document.getElementById("tx").value = "";
              setEntityName(null);
              setSelectedData(null);
            }}
          >
            <Cancel style={{ fontSize: 20 }} />
          </IconButton>
        )}

        <IconButton
          style={{ marginTop: 10 }}
          onClick={() => setShowCreateItem(true)}
        >
          <AddCircleIcon style={{ fontSize: 30 }} />
        </IconButton>
      </div>
    </>
  );
}
const mapStateToProps = ({ authStorage }) => {
  return {
    token: authStorage.token,
  };
};
export default connect(mapStateToProps)(autocomplete);
